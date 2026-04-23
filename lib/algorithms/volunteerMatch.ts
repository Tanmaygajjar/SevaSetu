import { Need, Volunteer, VolunteerMatch, MatchBreakdown } from '@/types';
import { haversineDistance } from '@/lib/utils';

export function matchVolunteers(
  need: Need,
  volunteers: Volunteer[],
  topN: number = 5
): VolunteerMatch[] {
  const eligible = volunteers.filter(v =>
    !v.is_on_break &&
    v.wellness_score >= 30 &&
    v.status === 'available'
  );

  const scored: VolunteerMatch[] = eligible.map(volunteer => {
    const breakdown = calculateBreakdown(need, volunteer);
    const totalScore = breakdown.skillFit + breakdown.proximity + breakdown.availability + breakdown.performance;
    const distanceKm = haversineDistance(
      volunteer.location_lat, volunteer.location_lng,
      need.location_lat, need.location_lng
    );

    return {
      volunteer,
      totalScore: Math.round(totalScore * 10) / 10,
      breakdown,
      distanceKm: Math.round(distanceKm * 10) / 10,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored.slice(0, topN);
}

function calculateBreakdown(need: Need, volunteer: Volunteer): MatchBreakdown {
  // Skill fit (35 pts)
  let skillFit = 35;
  const needSkills = need.required_skills || [];
  const volunteerSkills = volunteer.skills || [];

  if (needSkills.length > 0) {
    const matched = needSkills.filter(s =>
      volunteerSkills.includes(s)
    ).length;
    skillFit = (matched / needSkills.length) * 35;
  }

  // Proximity (30 pts)
  const vLat = volunteer.location_lat || 0;
  const vLng = volunteer.location_lng || 0;
  const nLat = need.location_lat || 0;
  const nLng = need.location_lng || 0;

  const distKm = haversineDistance(vLat, vLng, nLat, nLng);
  let proximity = 0;
  if (distKm <= 1) proximity = 30;
  else if (distKm <= 3) proximity = 25;
  else if (distKm <= 5) proximity = 18;
  else if (distKm <= 10) proximity = 10;
  else if (distKm <= 20) proximity = 5;

  // Availability (20 pts)
  let availability = 0;
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = dayNames[now.getDay()];
  const hour = now.getHours();
  let period = 'morning';
  if (hour >= 12 && hour < 17) period = 'afternoon';
  else if (hour >= 17) period = 'evening';
  const slotKey = `${day}_${period}`;

  if (volunteer.availability && volunteer.availability[slotKey]) {
    availability = 20;
  } else {
    // Check if available any time today
    const todaySlots = ['morning', 'afternoon', 'evening'].map(p => `${day}_${p}`);
    const availableToday = todaySlots.some(s => volunteer.availability?.[s]);
    if (availableToday) availability = 10;
  }

  // Performance (15 pts)
  const totalDone = volunteer.total_tasks_done || 0;
  const avgRating = totalDone > 0
    ? 3.5 + (totalDone * 0.1) 
    : 3.5;
  const performance = Math.min((avgRating / 5) * 15, 15);

  return {
    skillFit: Math.round(skillFit * 10) / 10,
    proximity: Math.round(proximity * 10) / 10,
    availability: Math.round(availability * 10) / 10,
    performance: Math.round(performance * 10) / 10,
  };
}
