import { db } from './firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  limit,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { Need, Volunteer, Task } from '@/types';
import { matchVolunteers } from './algorithms/volunteerMatch';
import toast from 'react-hot-toast';

export const MAX_TASKS_PER_VOLUNTEER = 3;

export async function getActiveTaskCount(volunteerId: string): Promise<number> {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef, 
    where('volunteer_id', '==', volunteerId),
    where('status', 'in', ['assigned', 'accepted', 'in_progress'])
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function assignTask(needId: string, volunteerId: string, ngoId: string | null = null) {
  const count = await getActiveTaskCount(volunteerId);
  
  if (count >= MAX_TASKS_PER_VOLUNTEER) {
    throw new Error(`Volunteer already has ${MAX_TASKS_PER_VOLUNTEER} active tasks.`);
  }

  const taskRef = await addDoc(collection(db, 'tasks'), {
    need_id: needId,
    volunteer_id: volunteerId,
    ngo_id: ngoId,
    status: 'assigned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  await updateDoc(doc(db, 'needs', needId), {
    status: 'assigned',
    assigned_volunteer_id: volunteerId // For quick reference
  });

  return taskRef.id;
}

export async function autoAssignVolunteerForNeed(need: Need) {
  const volunteersRef = collection(db, 'volunteers');
  const q = query(volunteersRef, where('status', '==', 'available'));
  const snapshot = await getDocs(q);
  const allVolunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Volunteer[];

  const numNeeded = need.volunteers_needed || 1;
  const assignedVolunteers: Volunteer[] = [];
  
  // 1. Find all eligible (not on break, wellness score ok)
  const eligibleVolunteers = allVolunteers.filter(v => !v.is_on_break && v.wellness_score >= 30);
  
  // 2. Rank all eligible
  const matches = matchVolunteers(need, eligibleVolunteers, allVolunteers.length);
  
  // 3. Try to assign up to numNeeded
  for (const match of matches) {
    if (assignedVolunteers.length >= numNeeded) break;
    
    const v = match.volunteer;
    const count = await getActiveTaskCount(v.id);
    
    if (count < MAX_TASKS_PER_VOLUNTEER) {
      await assignTask(need.id, v.id, need.ngo_id);
      assignedVolunteers.push(v);
    } else {
      // Volunteer was a good match but is at capacity
      console.log(`Volunteer ${v.name} is a match but at capacity (${count} tasks).`);
    }
  }

  if (assignedVolunteers.length < numNeeded) {
    // Notify about shortfall
    const shortfall = numNeeded - assignedVolunteers.length;
    toast(`Capacity Warning: Could only auto-assign ${assignedVolunteers.length}/${numNeeded} volunteers. ${shortfall} more needed.`, {
      icon: '⚠️',
      duration: 6000
    });
    
    // Logic to "find more people": In a real app, this could trigger an external broadcast 
    // or notify other nearby NGOs. For now, we just notify the coordinator.
  }

  return assignedVolunteers.length > 0 ? assignedVolunteers[0] : null;
}

export async function findBestTaskForVolunteer(volunteer: Volunteer) {
  if (volunteer.status !== 'available') {
    throw new Error(`${volunteer.name} is currently ${volunteer.status}. Only available volunteers can be auto-assigned.`);
  }

  const needsRef = collection(db, 'needs');
  const q = query(needsRef, where('status', '==', 'verified'), limit(20));
  const snapshot = await getDocs(q);
  let activeNeeds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Need[];

  if (activeNeeds.length === 0) {
    // Demo Fallback: Use some mock needs if DB is empty
    activeNeeds = [
        { id: 'kn-2', title: 'O+ Blood required at Civil', category: 'medical', urgency_score: 9.5, status: 'verified', city: 'Rajkot', location_lat: 22.3039, location_lng: 70.8022, required_skills: ['first_aid'] },
        { id: 'kn-5', title: '10 Volunteers for debris clearing', category: 'disaster_relief', urgency_score: 9.1, status: 'verified', city: 'Ahmedabad', location_lat: 23.0225, location_lng: 72.5714, required_skills: ['logistics'] }
    ] as any[];
  }

  const scoredNeeds = activeNeeds.map(need => {
    const matches = matchVolunteers(need, [volunteer], 1);
    return {
      need,
      score: matches.length > 0 ? matches[0].totalScore : 0
    };
  });

  scoredNeeds.sort((a, b) => b.score - a.score);
  
  if (scoredNeeds.length === 0 || scoredNeeds[0].score === 0) {
    return null;
  }

  return scoredNeeds[0].need;
}

export async function recommendVolunteerForNeed(need: Need) {
  const volunteersRef = collection(db, 'volunteers');
  const snapshot = await getDocs(query(volunteersRef, where('status', '==', 'available')));
  const allVolunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Volunteer[];

  if (allVolunteers.length === 0) return null;

  const matches = matchVolunteers(need, allVolunteers, 1);
  if (matches.length > 0) {
    const bestMatch = matches[0].volunteer;
    // Update the need with the recommendation
    const needRef = doc(db, 'needs', need.id);
    await updateDoc(needRef, {
      recommended_volunteer_id: bestMatch.id,
      ai_match_score: matches[0].totalScore
    });
    return bestMatch;
  }
  return null;
}
