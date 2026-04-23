import { Volunteer, Need } from '@/types';

export interface EfficiencyReport {
  score: number;
  reasoning: string[];
  comparativeAnalysis?: {
    otherVolunteerName: string;
    otherScore: number;
    difference: string;
  };
}

export async function analyzeAssignmentEfficiency(volunteer: any, task: any): Promise<EfficiencyReport> {
  // Mock AI Analysis Logic
  const volunteerSkills = volunteer.skills || [];
  const taskCategory = task.category || '';
  const taskTitle = task.title?.toLowerCase() || '';

  // Logic: Check if volunteer has direct skill for task
  const hasDirectSkill = volunteerSkills.some((s: string) => 
    taskTitle.includes(s.toLowerCase()) || 
    s.toLowerCase().includes(taskCategory.toLowerCase())
  );

  let score = 0;
  let reasoning: string[] = [];

  if (hasDirectSkill) {
    score = 92 + Math.random() * 5;
    reasoning = [
        "Volunteer has verified speciality in this domain.",
        "Previous mission history shows 100% success rate in similar tasks.",
        "High availability ensures immediate mission start."
    ];
  } else {
    score = 65 + Math.random() * 10;
    reasoning = [
        "Task falls outside the volunteer's primary speciality.",
        "Requires 20% more time for context switching and setup.",
        "Learning curve detected for specific tools required."
    ];
  }

  // Comparative analysis with a mock "Best Fit"
  const report: EfficiencyReport = {
    score: Math.round(score),
    reasoning
  };

  if (!hasDirectSkill) {
    report.comparativeAnalysis = {
        otherVolunteerName: "Rajesh Kumar",
        otherScore: 98,
        difference: "33% higher efficiency due to 'Elite Rescuer' certification."
    };
  }

  return report;
}
