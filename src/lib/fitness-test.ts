export type TestSection = {
	title: string;
	subtitle: string;
	goal: string;
	scoring: string;
	standards: Array<string>;
	target: number;
	elite: number; // elite target for scoring.
	duration: number; // total time for this section.
	rest: number; // time to rest between sections.
};

export const fitnessTest: Array<TestSection> = [
	{
		title: 'Suicide',
		subtitle: 'Muscular Endurance and speed',
		standards: ['Foot must touch the line'],
		goal: 'Complete a suicide in 32 seconds.',
		scoring: '2 points per-line achieved within the time limit. Every second under 32 = +2 points.',
		target: 16,
		elite: 20,
		duration: 32,
		rest: 28
	},
	{
		title: 'Press-Up Test',
		subtitle: 'Press ups to asses upper body strength',
		goal: 'Complete 30+ press-ups in one minute - as many as possible',
		scoring: '1 point per press-up, no maximum',
		standards: [
			'Elbows in or out',
			'Bend in arms must be at least 90° (use a cone if required)',
			'Full arm lock at the top',
			'No breaking of position (i.e. knees down)'
		],
		target: 30,
		elite: 50,
		duration: 60,
		rest: 60
	},
	{
		title: 'Power Endurance Test',
		subtitle: 'Court Widths to evaluate our speed and agility',
		goal: 'Complete as many court widths as possible in 30 seconds - 7 is the target',
		scoring: '1 point per width completed, no maximum',
		standards: ['Foot must touch each side line'],
		target: 7,
		elite: 9,
		duration: 30,
		rest: 60
	},
	{
		title: 'Sit-Up Test',
		subtitle: 'Sit-ups to assess core strength',
		goal: 'As many sit-ups as you can in two minutes, target is 50+',
		scoring: '1 point per sit-up, no maximum',
		standards: [
			'Bum must stay on the floorm feet against the wall',
			'Shoulder must return to the floor',
			'Sit up to 45° minimum'
		],
		target: 50,
		elite: 75,
		duration: 120,
		rest: 60
	},
	{
		title: 'Lateral Jingle-Jangles',
		subtitle: 'Agility and Power',
		goal: '15 jingles in 30 seconds',
		scoring: '2 points per line touched, no maximum',
		standards: ['Hand and foot must touch each line'],
		target: 30,
		elite: 36,
		duration: 30,
		rest: 60
	},
	{
		title: 'Endurance/\u200bDetermination Test',
		subtitle: '12 Min Cardiovascular Assessment',
		goal: '75+ full courts sprints in 12 minutes',
		scoring: '1 point per length, no maximum',
		standards: ['Foot must touch each base line'],
		target: 75,
		elite: 90,
		duration: 12 * 60,
		rest: 0
	}
];
