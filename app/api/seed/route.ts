import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { CITIES, CATEGORY_COLORS } from '@/types';

export async function GET() {
  try {
    // Check if seeded
    const statsDoc = await db.collection('platform_stats').doc('global').get();
    
    if (statsDoc.exists && statsDoc.data()?.total_volunteers > 0) {
      return NextResponse.json({ seeded: true, message: 'Already seeded' });
    }

    // 1. Seed Platform Stats
    await db.collection('platform_stats').doc('global').set({
      total_volunteers: 2847,
      active_today: 143,
      needs_resolved: 18492,
      ngos_registered: 312,
      cities_covered: 5,
      avg_response_minutes: 23,
      people_helped: 18492,
      volunteer_hours: 45000,
    });

    // We can't easily seed auth.users from client without Admin API, so we skip auth.users
    // and just insert profiles if RLS allows or we use service role. Since we use service role, 
    // it will bypass RLS but foreign key to auth.users will fail unless users exist.
    // The instructions say "Demo login: 5 role buttons on login page work instantly" and uses
    // our authStore mock users. The real DB seed is just for public data like needs and NGOs.
    
    // Seed NGOs
    const ngos = [
      {
        name: 'Disha Foundation',
        slug: 'disha-foundation',
        description: 'Empowering marginalized communities through education and healthcare.',
        verification_status: 'verified',
        focus_areas: ['education', 'medical'],
        sdg_goals: ['SDG3', 'SDG4'],
        operating_cities: ['Rajkot', 'Ahmedabad'],
      },
      {
        name: 'Sanjeevani Relief',
        slug: 'sanjeevani-relief',
        description: 'Rapid response disaster relief and food distribution across Gujarat and Maharashtra.',
        verification_status: 'verified',
        focus_areas: ['disaster_relief', 'food', 'shelter'],
        sdg_goals: ['SDG2', 'SDG11'],
        operating_cities: ['Surat', 'Pune', 'Nagpur'],
      }
    ];

    const ngoDocs = [];
    for (const ngo of ngos) {
      const docRef = await db.collection('ngos').add(ngo);
      ngoDocs.push({ id: docRef.id, ...ngo });
    }

    // Seed Needs (realistic data based on cities)
    const needsData = [
      {
        title: 'Emergency Medical Supplies Needed for Elderly Home',
        description: 'An elderly care facility in central Rajkot is out of essential diabetes and blood pressure medication due to supply chain issues.',
        category: 'medical',
        status: 'reported',
        sdg_tags: ['SDG3'],
        location_lat: CITIES[0].lat + 0.01,
        location_lng: CITIES[0].lng - 0.01,
        location_address: '12, MG Road, Rajkot',
        district: 'Rajkot',
        city: 'Rajkot',
        state: 'Gujarat',
        urgency_score: 8.5,
        severity_rating: 8,
        population_count: 45,
        is_time_sensitive: true,
        volunteers_needed: 2,
        estimated_hours: 3,
      },
      {
        title: 'Food Distribution Camp Volunteers Required',
        description: 'Need volunteers to help distribute hot meals to daily wage workers affected by recent floods in Surat.',
        category: 'food',
        status: 'verified',
        sdg_tags: ['SDG2', 'SDG10'],
        location_lat: CITIES[1].lat,
        location_lng: CITIES[1].lng,
        location_address: 'Udhna, Surat',
        district: 'Surat',
        city: 'Surat',
        state: 'Gujarat',
        urgency_score: 7.2,
        severity_rating: 6,
        population_count: 200,
        is_time_sensitive: false,
        volunteers_needed: 5,
        estimated_hours: 4,
        ngo_id: ngoDocs[1]?.id,
      },
      {
        title: 'Temporary Shelter Setup',
        description: 'Looking for physically fit volunteers to assemble temporary tents for displaced families.',
        category: 'shelter',
        status: 'reported',
        sdg_tags: ['SDG11'],
        location_lat: CITIES[3].lat - 0.02,
        location_lng: CITIES[3].lng + 0.015,
        location_address: 'Shivajinagar, Pune',
        district: 'Pune',
        city: 'Pune',
        state: 'Maharashtra',
        urgency_score: 9.1,
        severity_rating: 9,
        population_count: 80,
        is_time_sensitive: true,
        volunteers_needed: 8,
        estimated_hours: 6,
      }
    ];

    for (const need of needsData) {
      await db.collection('needs').add(need);
    }

    return NextResponse.json({ seeded: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
