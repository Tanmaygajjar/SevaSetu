import { NextResponse } from 'next/server';
import { autonomousDispatchDecision } from '@/lib/ai/gemini';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { needId } = await request.json();
    
    // 1. Get Need Detail
    const needSnap = await getDocs(query(collection(db, 'needs'), where('id', '==', needId)));
    if (needSnap.empty) return NextResponse.json({ error: "Need not found" }, { status: 404 });
    const need = { id: needSnap.docs[0].id, ...needSnap.docs[0].data() };

    // 2. Get Available Volunteers
    const volSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'volunteer'), where('status', '==', 'active')));
    const volunteers = volSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 3. AI Dispatch Decision
    const decision = await autonomousDispatchDecision(need, volunteers);
    
    if (decision && decision.confidence > 0.8) {
      // 4. Create Task Automatically
      const taskRef = await addDoc(collection(db, 'tasks'), {
        need_id: needId,
        volunteer_id: decision.volunteerId,
        status: 'assigned', // Auto-assigned
        assigned_at: new Date().toISOString(),
        dispatch_reason: decision.reason,
        is_autonomous: true
      });

      // 5. Update Need Status
      await updateDoc(doc(db, 'needs', needSnap.docs[0].id), {
        status: 'assigned'
      });

      return NextResponse.json({ success: true, taskId: taskRef.id, volunteerId: decision.volunteerId });
    }

    return NextResponse.json({ success: false, reason: "No high-confidence match found for autonomous dispatch." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
