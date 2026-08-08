import type { AccommodationCategory } from '../types/common';

export interface AdaptivePESection {
  category: AccommodationCategory;
  strategies: string[];
  equipment: string[];
}

export const ADAPTIVE_PE_SECTIONS: AdaptivePESection[] = [
  {
    category: 'mobility',
    strategies: [
      'Always offer a seated or wheelchair-accessible version of the activity - shooting, throwing, and striking can all be done from a chair.',
      'Shorten distances and lower targets/goals rather than removing the student from the activity.',
      'Let a peer buddy or paraeducator assist with retrieving equipment, pushing a wheelchair, or providing a steady hand for balance.',
      'Widen boundaries and remove time pressure - "everyone finishes" beats "first to finish."',
      'Ask the student (or their IEP/504 team) what they can do independently before assuming what they need help with.',
    ],
    equipment: [
      'Ramps for bowling, rolling, or releasing a ball with more distance and control.',
      'Velcro mitts and matching-fabric balls for students who can’t grip and release a throw.',
      'Lighter, larger, slower-moving balls (beach balls, balloons) instead of standard equipment.',
      'Scooter boards or adapted tricycles for locomotor activities.',
      'Lowered hoops, nets, and targets.',
    ],
  },
  {
    category: 'visual',
    strategies: [
      'Describe the space out loud before starting - where the walls, goals, and other students are.',
      'Use a sighted guide or peer buddy (running side-by-side, holding a short tether rope or hands) for locomotor activities.',
      'Give verbal play-by-play and directional cues ("ball coming from your left") instead of relying on gestures.',
      'Keep the activity space and equipment layout consistent between classes so it becomes familiar.',
      'Pair a student up with the same partner for a few classes in a row while they learn the routine.',
    ],
    equipment: [
      'Beeper or bell balls that make sound as they move.',
      'Brightly colored, high-contrast equipment (bright targets against a plain background).',
      'Textured or tactile boundary markers (a rope taped to the floor, textured mats) instead of only visual lines.',
      'A guide rope strung between two points for running/locomotor activities.',
    ],
  },
  {
    category: 'sensory',
    strategies: [
      'Use a visual schedule or "first-then" board so the student knows what’s coming next.',
      'Give advance warning before transitions and loud sounds - a raised hand or light switch instead of a sudden whistle blast.',
      'Keep warm-up and closure routines consistent every class - predictability lowers anxiety.',
      'Offer a designated quiet/calm-down spot the student can use if they need a break, without it being a consequence.',
      'Reduce group size and crowding at any one station - the poly-spot personal-space setup already used in this app’s lessons helps with this.',
      'Allow noise-canceling headphones or ear defenders during loud games.',
      'Offer choices within the structure ("push the ball or roll it - you pick") rather than an all-or-nothing participation ask.',
    ],
    equipment: [
      'Visual schedule/task cards showing the steps of an activity in pictures.',
      'Noise-canceling headphones or ear defenders.',
      'Poly spots or hoops to mark clear personal space at every station.',
      'A visible timer so transitions are predictable.',
    ],
  },
  {
    category: 'cognitive',
    strategies: [
      'Break each skill into 2-3 small, numbered steps (task analysis) instead of one long instruction.',
      'Demonstrate first, then have the student copy you side-by-side before they try it alone.',
      'Pair with a peer buddy for games with multiple rules or fast-changing situations.',
      'Simplify verbal instructions and pair every instruction with a visual or physical demonstration.',
      'Use hand-over-hand guidance for a new skill only as long as needed, fading support as the student gains independence.',
      'Reduce the number of rules in play at once - introduce one new rule at a time rather than the full game immediately.',
      'Give specific, frequent positive reinforcement ("Great pass!") rather than general praise.',
    ],
    equipment: [
      'Picture/task cards showing the steps of a skill in order.',
      'Color-coded equipment or spots that match a simple instruction ("stand on the red spot").',
    ],
  },
];

export const UDL_PRINCIPLES = [
  'Design the activity to have a modified version ready before class starts, not improvised on the spot.',
  'Offer multiple ways to participate (throw, roll, or push - whatever gets the student successfully involved) rather than one single "right" way to do the activity.',
  'Check the student’s IEP or 504 plan for specific accommodations, and loop in their paraeducator or special education teacher on the day’s plan.',
  'Talk with the whole class about inclusion and how to be a good teammate/peer buddy - the goal is that every student in the room helps make the activity work for everyone.',
  'Adjust the rule, not the student’s presence - almost any elementary PE activity has a version every student in the class can do together.',
];

export const LEGAL_BASICS = [
  'IDEA (the Individuals with Disabilities Education Act) guarantees eligible students a Free Appropriate Public Education, including physical education - PE is a required service, not an optional extra.',
  'A student’s IEP (Individualized Education Program) or 504 Plan may name specific PE accommodations - always check it rather than guessing, and follow it the same way a classroom teacher would.',
  'LRE (Least Restrictive Environment) means students with disabilities should be included in general PE alongside peers whenever appropriate, with separate/adapted PE used only when the general setting genuinely can’t meet their needs - inclusion is the starting assumption, not the exception.',
  'If a student seems to need more support than general PE accommodations can provide, that’s a conversation for the school’s adapted PE specialist or special education team, not a decision to make alone.',
];
