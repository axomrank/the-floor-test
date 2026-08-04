/**
 * The Floor Test - Constitutional Majority Simulator
 * Core Application Script
 */

// Audio synthesizer function for sound effects
function playSynthSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === "click") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === "success") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(261.63, now); // C4
            osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
            osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
            osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
            gainNode.gain.setValueAtTime(0.25, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === "fail") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(75, now + 0.35);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
        }
    } catch (e) {
        console.warn("AudioContext not supported or allowed.", e);
    }
}

// ==========================================================================
// 1. DATA CONSTANTS & DATABASE
// ==========================================================================

const CHAPTERS_DATA = {
    1: {
        title: "Simple Majority",
        subtitle: "The baseline democratic mechanism of the floor test.",
        ruleName: "Simple Majority",
        ruleFormula: "> 50% of Members Present & Voting",
        concepts: [
            {
                term: "Definition",
                desc: "A majority of <strong>more than 50% of the members present and voting</strong> in the house. It does not count members who are absent or those who choose to abstain from voting.",
                tip: "This is the most common majority used in ordinary day-to-day legislative business."
            },
            {
                term: "Applicability",
                desc: "Used for passing <strong>Ordinary Bills, Money Bills, Financial Bills</strong>, and motions like the <strong>Confidence Motion, No-Confidence Motion, and Censure Motion</strong>.",
                tip: "Also used for declaring President's Rule (Art. 356) and Financial Emergency (Art. 360)."
            },
            {
                term: "The Math",
                desc: "If House Strength = 545, Vacancies = 5, Absentees/Abstentions = 140, then:<br>Effective present & voting = 545 - 5 - 140 = 400.<br>Passing Threshold = <strong>(400 / 2) + 1 = 201 votes</strong>.",
                tip: "Notice how vacancies and abstentions drop the required target threshold!"
            }
        ],
        timeline: [
            {
                year: "1860",
                title: "The Indigo Commission",
                desc: "Established under the Indigo Commission Act to investigate indigo farmers' exploitation. Passed with a simple majority voice vote.",
                lesson: "Simple majority was the primary mechanism used by colonial councils to pass urgent administrative regulations."
            },
            {
                year: "1956",
                title: "States Reorganisation Act",
                desc: "A massive simple-majority legislative reform that redrew boundaries of Indian states based on linguistic lines under Article 3.",
                lesson: "Even major constitutional re-mappings only require a Simple Majority under Article 4."
            },
            {
                year: "2019",
                title: "Article 370 Abrogation",
                desc: "The resolutions to render Article 370 inoperative and reorganise Jammu & Kashmir were passed using simple majorities in both houses.",
                lesson: "Highlighting how simple majorities can enact highly impactful geopolitical restructuring."
            }
        ],
        simulator: {
            title: "Pass the Delhi Services Bill",
            desc: "The Lok Sabha has a total strength of 543. There are 13 vacancies. On the day of voting, 110 opposition members staged a walkout. Drag enough coalition blocks into the 'Aye' drop zone to pass the bill using a Simple Majority.",
            totalSeats: 543,
            vacancies: 13,
            absent: 110,
            factions: [
                { id: "coalition-1", name: "Ruling Party Core", size: 190, coalition: "Treasury" },
                { id: "coalition-2", name: "Alliance Partner A", size: 45, coalition: "Treasury" },
                { id: "coalition-3", name: "Alliance Partner B", size: 30, coalition: "Treasury" },
                { id: "opposition-1", name: "Main Opposition Party", size: 90, coalition: "Opposition" },
                { id: "opposition-2", name: "Left Front Block", size: 40, coalition: "Opposition" },
                { id: "independents", name: "Undecided/Independents", size: 25, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const threshold = Math.floor(presentVoting / 2) + 1;
                return {
                    success: ayes >= threshold,
                    threshold: threshold,
                    formula: `Ayes (${ayes}) must be >= Simple Majority Threshold (${threshold}) out of ${presentVoting} voting members.`
                };
            }
        },
        questions: [
            {
                text: "The Lok Sabha has a total strength of 543. There are 10 vacancies. On a bill concerning financial regulations, 83 members are absent. During division, 50 members present decide to abstain from voting. What is the minimum number of 'Aye' votes required to pass this bill?",
                options: [
                    "A) 201 votes",
                    "B) 203 votes",
                    "C) 226 votes",
                    "D) 250 votes"
                ],
                correctIndex: 0,
                formula: "Simple Majority = > 50% of present & voting. Present & voting = 543 - 10 - 83 - 50 = 400. Threshold = (400 / 2) + 1 = 201.",
                explanation: "Under the simple majority rule, vacancies (10), absentees (83), and abstentions (50) are excluded from the denominator. This leaves a voting strength of 400. A simple majority requires more than 50% of this figure, which mathematically translates to at least 201 'Aye' votes."
            },
            {
                text: "Which of the following motions or bills does NOT require a Simple Majority to be carried in the House of the People (Lok Sabha)?",
                options: [
                    "A) Adjournment Motion",
                    "B) No-Confidence Motion",
                    "C) Constitutional Amendment Bill under Article 368",
                    "D) Money Bill under Article 110"
                ],
                correctIndex: 2,
                formula: "Constitutional Amendment (Art. 368) requires Special Majority",
                explanation: "A Constitutional Amendment Bill under Article 368 requires a special majority (majority of total membership AND 2/3 of present and voting). Ordinary bills like Money Bills, and procedural motions like Adjournment or No-Confidence motions only require a Simple Majority."
            },
            {
                text: "If a No-Confidence Motion is put to vote in the Lok Sabha with a current active strength of 530 (13 vacancies). If 100 members abstain from voting, what is the threshold of 'Aye' votes the Opposition needs to collapse the government?",
                options: [
                    "A) 216 votes",
                    "B) 266 votes",
                    "C) 215 votes",
                    "D) 265 votes"
                ],
                correctIndex: 0,
                formula: "Threshold = (Present & Voting / 2) + 1. P&V = 530 - 100 = 430. Threshold = (430/2) + 1 = 216.",
                explanation: "Simple majority requires > 50% of present and voting. Out of 530 active members, 100 abstained, leaving 430 present and voting. Half of 430 is 215, so more than 50% is 216 votes."
            }
        ]
    },
    2: {
        title: "Absolute Majority",
        subtitle: "The mandatory benchmark for government formation.",
        ruleName: "Absolute Majority",
        ruleFormula: "> 50% of Total Sanctioned Strength",
        concepts: [
            {
                term: "Definition",
                desc: "A majority of <strong>more than 50% of the total statutory/sanctioned strength</strong> of the house. It does not deduct vacancies, absentees, or abstentions.",
                tip: "This is a fixed number regardless of temporary fluctuations in active membership."
            },
            {
                term: "Applicability",
                desc: "Used during <strong>Government Formation</strong> to prove a party or coalition has the mandate to govern. It is also the first sieve condition in Article 368.",
                tip: "For a Lok Sabha of 543 seats, the Absolute Majority is always 273 votes."
            },
            {
                term: "The Math",
                desc: "If statutory strength = 543, then:<br>Passing Threshold = <strong>(543 / 2) + 1 = 272.5 rounded up to 273</strong>.<br>Even if 200 seats are vacant, you still need 273!",
                tip: "This ensures stability and prevents minority control during high vacancy periods."
            }
        ],
        timeline: [
            {
                year: "1977",
                title: "Post-Emergency Shift",
                desc: "The Janata Party coalition secured an absolute majority, crossing the 273 mark, marking the first non-Congress central government.",
                lesson: "Absolute majority is the primary constitutional test for claiming the right to form a government."
            },
            {
                year: "1984",
                title: "Landslide Mandate",
                desc: "The Congress party secured over 400 seats following the general election, establishing a massive absolute majority.",
                lesson: "A strong absolute majority minimizes coalition vulnerabilities in the legislature."
            },
            {
                year: "2014",
                title: "Single Party Majority",
                desc: "The BJP won 282 seats, crossing the 273 threshold alone, forming the first single-party absolute majority government in 30 years.",
                lesson: "Single party absolute majorities make governance highly centralized."
            }
        ],
        simulator: {
            title: "Prove Government Formation Mandate",
            desc: "The Lok Sabha has a total strength of 543. To claim the right to form a government, you must drag factions representing a solid majority to the 'Aye' drop zone to cross the absolute majority threshold of 273.",
            totalSeats: 543,
            vacancies: 0,
            absent: 0,
            factions: [
                { id: "coalition-1", name: "Major Party Core", size: 240, coalition: "Treasury" },
                { id: "coalition-2", name: "Regional Ally A", size: 25, coalition: "Treasury" },
                { id: "coalition-3", name: "Regional Ally B", size: 15, coalition: "Treasury" },
                { id: "opposition-1", name: "Opposition Front", size: 220, coalition: "Opposition" },
                { id: "independents", name: "Independents/Others", size: 43, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const threshold = Math.floor(543 / 2) + 1; // 273
                return {
                    success: ayes >= threshold,
                    threshold: threshold,
                    formula: `Ayes (${ayes}) must satisfy the Absolute Majority threshold of 273 (50% of total 543 + 1).`
                };
            }
        },
        questions: [
            {
                text: "In a House with a total sanctioned strength of 500, there are 40 vacant seats on the voting day. What is the absolute majority threshold required to pass a government formation floor test?",
                options: [
                    "A) 231 votes",
                    "B) 251 votes",
                    "C) 211 votes",
                    "D) 273 votes"
                ],
                correctIndex: 1,
                formula: "Absolute Majority = (Total Strength / 2) + 1 = (500 / 2) + 1 = 251.",
                explanation: "Absolute majority is calculated on the total sanctioned strength (500), NOT the active strength. Vacancies do not reduce the denominator. Therefore, the threshold remains 251 votes."
            },
            {
                text: "Why does the Indian Constitution require an Absolute Majority for government formation tests?",
                options: [
                    "A) To ensure that coalitions represent at least 2/3 of voters",
                    "B) To prevent a minority government from ruling without stable legislative backing",
                    "C) To allow the President to choose any candidate",
                    "D) To simplify voting in Rajya Sabha"
                ],
                correctIndex: 1,
                explanation: "Requiring more than 50% of the total statutory strength ensures the government has the stability of a true house majority, preventing weak, highly vulnerable minority governments."
            },
            {
                text: "If a house has a total sanctioned strength of 100, and 20 members are absent during a vote, what is the absolute majority threshold?",
                options: [
                    "A) 41 votes",
                    "B) 51 votes",
                    "C) 31 votes",
                    "D) 40 votes"
                ],
                correctIndex: 1,
                formula: "Threshold = (100 / 2) + 1 = 51.",
                explanation: "Absentees do not affect the absolute majority calculation, which is always based on the full statutory capacity. The threshold remains 51."
            }
        ]
    },
    3: {
        title: "Effective Majority",
        subtitle: "Used for structural changes and removal of key officers.",
        ruleName: "Effective Majority",
        ruleFormula: "> 50% of Effective Strength (Total - Vacancies)",
        concepts: [
            {
                term: "Effective Strength",
                desc: "Effective Strength is defined as the <strong>Total Strength of the House minus Vacancies</strong> (due to resignation, death, or disqualification).",
                tip: "Note that absentees and abstentions are NOT deducted when calculating effective strength!"
            },
            {
                term: "Applicability",
                desc: "An <strong>Effective Majority</strong> is used to remove the <strong>Vice President (ex-officio Chairman of Rajya Sabha)</strong>, the <strong>Speaker, or the Deputy Speaker</strong> of Lok Sabha/Vidhan Sabha.",
                tip: "Under Article 94(c), the Speaker is removed by a resolution passed by a majority of all the *then* members of the House."
            },
            {
                term: "The Math",
                desc: "If House Strength = 545, Vacancies = 45, then:<br>Effective Strength = 545 - 45 = 500.<br>Passing Threshold = <strong>(500 / 2) + 1 = 251 votes</strong>.",
                tip: "Absentees (e.g. 100) do not change this denominator; only actual vacant seats are deducted."
            }
        ],
        timeline: [
            {
                year: "1954",
                title: "First Speaker Challenge",
                desc: "A resolution to remove G.V. Mavalankar, the first Lok Sabha Speaker, was moved. It required an Effective Majority to pass, but was ultimately defeated.",
                lesson: "Constitutional founders made Speaker removal difficult (Effective Majority) to prevent partisan removals during temporary attendance drops."
            },
            {
                year: "2004",
                title: "Rajya Sabha Chairman Voting",
                desc: "Resolutions related to Rajya Sabha administration and presiding officers highlighted the distinction of excluding vacant seats from the voting pool.",
                lesson: "Vacancies are seats that literally do not exist in the active register on the voting day."
            },
            {
                year: "2024",
                title: "Modern Floor Tests",
                desc: "State Vidhan Sabhas frequently calculate Effective Majority when speakers are challenged before governments face confidence votes.",
                lesson: "The 'then members' clause dynamically updates the house strength based on current disqualifications."
            }
        ],
        simulator: {
            title: "Remove the Speaker of the House",
            desc: "A resolution has been moved to remove the Speaker of Lok Sabha. The total strength of the house is 543. However, there are 23 vacancies due to recent disqualifications. 120 members are absent on the day of voting. Drag enough blocks into the 'Aye' zone to satisfy the Effective Majority required.",
            totalSeats: 543,
            vacancies: 23,
            absent: 120,
            factions: [
                { id: "coalition-1", name: "Dissident Bloc", size: 140, coalition: "Treasury" },
                { id: "coalition-2", name: "Opposition Front", size: 130, coalition: "Opposition" },
                { id: "coalition-3", name: "Ruling Loyalists", size: 150, coalition: "Treasury" },
                { id: "coalition-4", name: "Independents", size: 20, coalition: "Neutral" },
                { id: "coalition-5", name: "Neutral Bloc", size: 80, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const effectiveStrength = 543 - 23; // 520
                const threshold = Math.floor(effectiveStrength / 2) + 1; // 261
                return {
                    success: ayes >= threshold,
                    threshold: threshold,
                    formula: `Ayes (${ayes}) must be >= Effective Majority Threshold (${threshold}) [50% of Effective Strength 520].`
                };
            }
        },
        questions: [
            {
                text: "A resolution to remove the Deputy Speaker of Lok Sabha is moved. The statutory strength of the House is 543. There are 43 vacancies. 100 members are absent, and 50 members abstain from voting. How many votes of 'Aye' are required to pass this resolution?",
                options: [
                    "A) 176 votes",
                    "B) 251 votes",
                    "C) 272 votes",
                    "D) 201 votes"
                ],
                correctIndex: 1,
                formula: "Effective Strength = 543 - 43 = 500. Effective Majority = (500 / 2) + 1 = 251.",
                explanation: "Removal of the Deputy Speaker requires an effective majority. Effective Strength = Total Strength (543) - Vacancies (43) = 500. Absentees and abstentions are NOT deducted for Effective Strength. Threshold = 50% of 500 + 1 = 251."
            },
            {
                text: "The term 'all the then members of the Council' in Article 67(b) regarding the removal of the Vice President of India refers to which type of majority in the Rajya Sabha?",
                options: [
                    "A) Absolute Majority",
                    "B) Special Majority",
                    "C) Simple Majority",
                    "D) Effective Majority"
                ],
                correctIndex: 3,
                formula: "'All the then members' = Effective Majority",
                explanation: "The phrase 'all the then members' means the members present in the register, excluding vacancies. This is the definition of an Effective Majority."
            },
            {
                text: "In a house of 300 seats, there are 20 vacancies. A resolution is moved to remove the Speaker. If 200 members vote, what is the required threshold to pass the resolution?",
                options: [
                    "A) 101 votes",
                    "B) 141 votes",
                    "C) 151 votes",
                    "D) 121 votes"
                ],
                correctIndex: 1,
                formula: "Effective Strength = 300 - 20 = 280. Threshold = (280/2) + 1 = 141.",
                explanation: "Effective Majority is calculated as > 50% of (Total - Vacancies). Effective Strength = 300 - 20 = 280. Majority threshold = 141. The number of voting members (200) does not change the Effective Strength denominator."
            }
        ]
    },
    4: {
        title: "Special Majority (Art. 249/312)",
        subtitle: "Federal override and national interest resolutions.",
        ruleName: "Special Majority under Art. 249 / 312",
        ruleFormula: ">= 2/3 of Members Present & Voting",
        concepts: [
            {
                term: "The 2/3rds Sieve",
                desc: "Requires a supermajority of <strong>at least two-thirds of the members present and voting</strong> during the division.",
                tip: "Unlike Article 368, there is NO absolute majority baseline requirement here."
            },
            {
                term: "Applicability",
                desc: "Used for Rajya Sabha resolutions to authorize Parliament to make laws on <strong>State List subjects (Art. 249)</strong> or to establish a new <strong>All-India Service (Art. 312)</strong>.",
                tip: "This allows Rajya Sabha, as the representative chamber of States, to grant federal powers to the Centre."
            },
            {
                term: "The Math",
                desc: "If Rajya Sabha Strength = 245, Vacancies = 5, Absentees/Abstentions = 60, then:<br>Present & Voting = 245 - 5 - 60 = 180.<br>Passing Threshold = <strong>(180 * 2) / 3 = 120 votes</strong>.",
                tip: "Note that vacancies and absentees directly lower the present and voting denominator."
            }
        ],
        timeline: [
            {
                year: "1952",
                title: "First State List Override",
                desc: "Rajya Sabha passed a resolution under Article 249 authorizing Parliament to legislate on trade and commerce within states in national interest.",
                lesson: "Article 249 serves as a flexible federal valve to handle national crises."
            },
            {
                year: "1966",
                title: "Indian Forest Service",
                desc: "Created the Indian Forest Service as a new All-India Service under Article 312 via a Rajya Sabha supermajority resolution.",
                lesson: "All-India Services require high state consensus, hence the 2/3rd voting requirement in Rajya Sabha."
            }
        ],
        simulator: {
            title: "Create the Indian Environmental Service",
            desc: "The Rajya Sabha is voting on a resolution under Article 312 to create a new All-India Service. The total strength of the house is 245, with 5 vacancies. 60 members are absent on the day of voting. Drag enough blocks into the 'Aye' zone to satisfy the 2/3rds present & voting threshold.",
            totalSeats: 245,
            vacancies: 5,
            absent: 60,
            factions: [
                { id: "coalition-1", name: "Ruling Party Block", size: 120, coalition: "Treasury" },
                { id: "coalition-2", name: "Support Block", size: 30, coalition: "Treasury" },
                { id: "coalition-3", name: "Opposition Block", size: 25, coalition: "Opposition" },
                { id: "coalition-4", name: "Neutrals", size: 10, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const threshold = Math.ceil((presentVoting * 2) / 3);
                return {
                    success: ayes >= threshold,
                    threshold: threshold,
                    formula: `Ayes (${ayes}) must be >= 2/3 of Present & Voting (${threshold}) out of ${presentVoting}.`
                };
            }
        },
        questions: [
            {
                text: "A resolution under Article 249 is put to vote in the Rajya Sabha (strength 245). 5 members are vacant, 40 are absent, and 20 abstain. How many 'Aye' votes are required to pass the resolution?",
                options: [
                    "A) 120 votes",
                    "B) 163 votes",
                    "C) 121 votes",
                    "D) 164 votes"
                ],
                correctIndex: 0,
                formula: "Present & voting = 245 - 5 - 40 - 20 = 180. Threshold = 2/3 of 180 = 120.",
                explanation: "Under Article 249, vacancies, absentees, and abstentions are excluded. This leaves 180 members present and voting. 2/3rds of 180 is exactly 120 votes."
            },
            {
                text: "Which chamber of Parliament has the exclusive power to initiate a resolution under Article 312 for creating a new All-India Service?",
                options: [
                    "A) Lok Sabha only",
                    "B) Rajya Sabha only",
                    "C) Joint Sitting of both houses",
                    "D) Either Lok Sabha or Rajya Sabha"
                ],
                correctIndex: 1,
                explanation: "Because Rajya Sabha represents the States, it has the exclusive privilege under Article 312 to initiate resolutions to create new All-India Services."
            },
            {
                text: "If a resolution under Article 249 receives 100 'Aye' votes with 144 members voting in the Rajya Sabha, does it pass?",
                options: [
                    "A) No, because it requires absolute majority support",
                    "B) Yes, because 100 is greater than 2/3 of 144",
                    "C) No, because 2/3 of 144 is 96, but it failed the vacancy check",
                    "D) Yes, because it satisfies a simple majority"
                ],
                correctIndex: 1,
                formula: "2/3 of 144 = 96. Ayes = 100 >= 96. Result = Pass.",
                explanation: "2/3 of 144 is 96. Since the resolution received 100 'Aye' votes, it satisfies the Article 249 requirement and passes."
            }
        ]
    },
    5: {
        title: "Special Majority (Art. 368)",
        subtitle: "The double-sieve formula for constitutional amendments.",
        ruleName: "Special Majority under Art. 368",
        ruleFormula: "> 50% of Total Strength AND >= 2/3 of Present & Voting",
        concepts: [
            {
                term: "The Double Sieve",
                desc: "To pass a Constitutional Amendment under Article 368, the bill must satisfy <strong>two conditions simultaneously</strong> during division voting.",
                tip: "If either condition fails, the bill fails immediately!"
            },
            {
                term: "Condition A",
                desc: "Must be supported by an <strong>Absolute Majority</strong>: more than 50% of the total statutory membership of the house (e.g., 273 or more in Lok Sabha).",
                tip: "This ensures that a thin attendance cannot alter the core constitutional charter."
            },
            {
                term: "Condition B",
                desc: "Must be supported by a <strong>2/3rds majority of the members present and voting</strong>. This is the supermajority component.",
                tip: "Even if you have 273 'Ayes', if there are 450 voting, 2/3 of 450 is 300, so you need 300 'Ayes'!"
            }
        ],
        timeline: [
            {
                year: "1975",
                title: "39th Amendment Act",
                desc: "Placed the election of the Prime Minister and Speaker beyond judicial review. It was rushed through using a Special Majority during Emergency.",
                lesson: "Illustrates that even special majorities can be achieved when political alignment is absolute."
            },
            {
                year: "1989",
                title: "61st Amendment Act",
                desc: "Lowered the voting age in India from 21 to 18 years. Passed with an overwhelming bipartisan Special Majority.",
                lesson: "Democratic expansions often receive near-unanimous special majority support."
            }
        ],
        simulator: {
            title: "Pass the GST Constitutional Amendment",
            desc: "The Lok Sabha is voting on a Constitutional Amendment Bill. The total strength of the house is 545 (with 5 vacancies). 450 members are present and voting. Drag the faction blocks to build a combination that satisfies both Article 368 Special Majority conditions.",
            totalSeats: 545,
            vacancies: 5,
            absent: 95,
            factions: [
                { id: "coalition-1", name: "Ruling Coalition Core", size: 280, coalition: "Treasury" },
                { id: "coalition-2", name: "Federal Regional Party A", size: 30, coalition: "Neutral" },
                { id: "coalition-3", name: "Federal Regional Party B", size: 25, coalition: "Neutral" },
                { id: "opposition-1", name: "Opposition Party A", size: 85, coalition: "Opposition" },
                { id: "opposition-2", name: "Opposition Party B", size: 30, coalition: "Opposition" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const condAThreshold = Math.floor(545 / 2) + 1; // 273
                const condBThreshold = Math.ceil((presentVoting * 2) / 3); // 300
                const success = ayes >= condAThreshold && ayes >= condBThreshold;
                const finalThreshold = Math.max(condAThreshold, condBThreshold);
                return {
                    success: success,
                    threshold: finalThreshold,
                    formula: `Requires Ayes >= 273 (Abs. Majority) AND Ayes >= 300 (2/3 of P&V). Current Ayes: ${ayes}.`
                };
            }
        },
        questions: [
            {
                text: "The Lok Sabha has a total strength of 545. On a Constitutional Amendment Bill (under Art. 368), 390 members are present and voting. What is the minimum number of 'Aye' votes required for the bill to pass?",
                options: [
                    "A) 260 votes",
                    "B) 273 votes",
                    "C) 261 votes",
                    "D) 274 votes"
                ],
                correctIndex: 1,
                formula: "Cond A: > 545/2 = 273. Cond B: >= 2/3 of 390 = 260. Required = max(273, 260) = 273.",
                explanation: "The double-sieve requires: (1) Absolute Majority (>50% of 545 = 273), and (2) 2/3rds of present & voting (2/3 of 390 = 260). The higher number of the two sieve outputs must be satisfied, which is 273."
            },
            {
                text: "The Lok Sabha has a total strength of 545. On a Constitutional Amendment Bill, 450 members are present and voting. What is the minimum number of 'Aye' votes required for this bill to pass?",
                options: [
                    "A) 273 votes",
                    "B) 300 votes",
                    "C) 301 votes",
                    "D) 226 votes"
                ],
                correctIndex: 1,
                formula: "Cond A: > 545/2 = 273. Cond B: >= 2/3 of 450 = 300. Required = max(273, 300) = 300.",
                explanation: "Here, 2/3rds of those present and voting is 300. Since 300 is also greater than the absolute majority requirement (273), 300 'Aye' votes are required."
            },
            {
                text: "If a Constitutional Amendment Bill receives 280 'Aye' votes in a Lok Sabha with 420 members present and voting (Total Strength 545), does the bill pass?",
                options: [
                    "A) Yes, because 280 is both > 273 and >= 2/3 of 420",
                    "B) No, because 2/3 of 420 is 280, but it fails the absolute majority requirement",
                    "C) Yes, because it satisfies the simple majority of present & voting",
                    "D) No, because it fails the effective majority requirement"
                ],
                correctIndex: 0,
                formula: "Ayes = 280. Cond A (273): Pass. Cond B (2/3 of 420 = 280): Pass. Result = Pass.",
                explanation: "Ayes (280) is greater than the Absolute Majority (273) and exactly equal to 2/3 of 420 (280). Thus, it satisfies both criteria and passes."
            }
        ]
    },
    6: {
        title: "Presidential Impeachment",
        subtitle: "The most stringent majority under the Indian Constitution.",
        ruleName: "Special Majority under Art. 61",
        ruleFormula: ">= 2/3 of the Total Strength of the House",
        concepts: [
            {
                term: "The Ultimate Threshold",
                desc: "Impeachment of the President of India under Article 61 requires a majority of <strong>not less than two-thirds of the total membership of the House</strong>.",
                tip: "This is the most rigid majority requirement in the entire Constitution."
            },
            {
                term: "No Reductions",
                desc: "Unlike other majorities, <strong>vacancies, absentees, and abstentions are NOT deducted</strong> from the denominator. The threshold is fixed and locked based on the statutory capacity of the chamber.",
                tip: "For a Lok Sabha of 545 seats, the threshold is ALWAYS 364 votes, even if only 370 members show up to vote!"
            }
        ],
        timeline: [
            {
                year: "1950",
                title: "Drafting Article 61",
                desc: "Constituent Assembly debated the impeachment rules. Dr. B.R. Ambedkar insisted on a rigid threshold to guarantee stability of the executive.",
                lesson: "The 2/3 of total membership rule was specifically chosen to avoid political victimization."
            },
            {
                year: "1993",
                title: "Justice Ramaswami Case",
                desc: "Though not a presidential impeachment, the removal of SC Justice V. Ramaswami failed in Lok Sabha because the ruling party abstained, preventing the 2/3 of present & voting requirement.",
                lesson: "Shows how high supermajority thresholds protect high office-holders from easy removal."
            }
        ],
        simulator: {
            title: "Impeach the President (Article 61)",
            desc: "Charges of 'Violation of the Constitution' have been preferred. The Lok Sabha has 545 seats, with 25 vacant. 100 members are absent. Drag enough faction blocks to Ayes to achieve the critical 2/3 of Total Strength required to pass the impeachment resolution.",
            totalSeats: 545,
            vacancies: 25,
            absent: 100,
            factions: [
                { id: "coalition-1", name: "Ruling Coalition Core", size: 300, coalition: "Treasury" },
                { id: "coalition-2", name: "Opposition Block", size: 180, coalition: "Opposition" },
                { id: "coalition-3", name: "Regional Parties", size: 40, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const threshold = Math.ceil((545 * 2) / 3); // 364
                return {
                    success: ayes >= threshold,
                    threshold: threshold,
                    formula: `Ayes (${ayes}) must be >= 2/3 of Total Sanctioned Strength (${threshold}) out of 545.`
                };
            }
        },
        questions: [
            {
                text: "The Lok Sabha has a total sanctioned strength of 545. If there are 35 vacancies and 110 members are absent on the voting day, how many 'Aye' votes are required to impeach the President?",
                options: [
                    "A) 267 votes",
                    "B) 364 votes",
                    "C) 340 votes",
                    "D) 273 votes"
                ],
                correctIndex: 1,
                formula: "Threshold = 2/3 of Total Strength (545) = 363.33 -> 364.",
                explanation: "Impeachment requires a majority of 2/3rds of the total membership. Denominator does not deduct vacancies (35) or absentees (110). Math: 545 * (2/3) = 363.33, which rounds up to 364."
            },
            {
                text: "Under Article 61 of the Indian Constitution, the President can be impeached on which of the following grounds?",
                options: [
                    "A) Proven misbehavior or incapacity",
                    "B) Violation of the Constitution",
                ],
                correctIndex: 1,
                formula: "Ground = 'Violation of the Constitution' (Art. 61)",
                explanation: "The President can be removed from office only by impeachment on the ground of 'Violation of the Constitution' (Article 61, Clause 1). The Constitution does not define this phrase."
            },
            {
                text: "For the impeachment resolution under Article 61 to be introduced, it must be signed by at least how many members of the House?",
                options: [
                    "A) 50 members",
                    "B) 100 members",
                    "C) One-tenth of the total membership",
                    "D) One-fourth of the total membership"
                ],
                correctIndex: 3,
                formula: "Introduction requirements = Signed by at least 1/4th of total membership",
                explanation: "According to Article 61(2)(a), the proposal to prefer such charge must be contained in a resolution moved after at least 14 days' written notice signed by not less than one-fourth of the total membership of the House."
            },
            {
                text: "In the Rajya Sabha (Total Strength 250), what is the minimum number of votes required to pass a Presidential impeachment resolution?",
                options: [
                    "A) 167 votes",
                    "B) 126 votes",
                    "C) 150 votes",
                    "D) 134 votes"
                ],
                correctIndex: 0,
                formula: "Rajya Sabha Threshold = 2/3 of 250 = 167",
                explanation: "The Rajya Sabha total strength is 250. 2/3 of 250 is 166.67, which rounds up to 167 votes required to pass the impeachment charge."
            },
            {
                text: "If a President's impeachment charge is being investigated by the Rajya Sabha, what rights does the President have during the proceedings?",
                options: [
                    "A) The President must resign immediately upon investigation initiation",
                    "B) The President has the right to appear and be represented at such investigation",
                    "C) The President can dissolve the investigating House",
                    "D) The President has no rights of representation before the Parliament"
                ],
                correctIndex: 1,
                formula: "Right to appear and be represented (Art. 61(3))",
                explanation: "Under Article 61(3), when a charge is being investigated by either House, the President has the right to appear and be represented during the investigation."
            }
        ]
    },
    7: {
        title: "Special (Art. 368 + Federal)",
        subtitle: "Sovereign checks requiring federal state ratification.",
        ruleName: "Special Majority with Federal Ratification",
        ruleFormula: "Art. 368 Majority + Ratification by >= 50% States",
        concepts: [
            {
                term: "Federal Check",
                desc: "Amendments that alter the <strong>federal structure</strong> of the nation require a dual lock: Parliamentary Special Majority under Article 368, AND consent of the states.",
                tip: "This prevents the Union Parliament from unilaterally altering state powers."
            },
            {
                term: "State Consent",
                desc: "The amendment must be ratified by the <strong>legislatures of not less than one-half of the States</strong> by resolutions passed to that effect.",
                tip: "State ratifications are passed by a simple majority in each state assembly!"
            },
            {
                term: "Applicable Clauses",
                desc: "Required for amendments affecting the <strong>Presidential election (Art. 54, 55)</strong>, representation of states in Parliament, the <strong>Seventh Schedule lists</strong>, or Article 368 itself.",
                tip: "This was the mechanism used to pass the historic GST system."
            }
        ],
        timeline: [
            {
                year: "1969",
                title: "22nd Amendment Act",
                desc: "Created the autonomous state of Meghalaya within Assam. Required federal state ratifications to restructure state territories.",
                lesson: "Significant shifts in state representation or territorial status invoke federal clauses."
            },
            {
                year: "2016",
                title: "The GST Act Passage",
                desc: "The 101st Amendment overhauled the tax structure. It passed Parliament by special majority and was ratified by 16 state assemblies.",
                lesson: "Economic federalism requires extensive consensus across both state and central assemblies."
            }
        ],
        simulator: {
            title: "Pass the Federal GST Amendment Bill",
            desc: "Restructure the federal tax system by passing the GST bill. The Lok Sabha has 545 seats (with 5 vacancies). 450 members are present and voting. Drag factions to satisfy the Article 368 dual-sieve parliamentary thresholds (max of 273 and 2/3 of 450 = 300).",
            totalSeats: 545,
            vacancies: 5,
            absent: 95,
            factions: [
                { id: "coalition-1", name: "Ruling Coalition Core", size: 290, coalition: "Treasury" },
                { id: "coalition-2", name: "State-Aligned Regional Party", size: 45, coalition: "Neutral" },
                { id: "opposition-1", name: "Opposition Core Party", size: 80, coalition: "Opposition" },
                { id: "independents", name: "Independents/Others", size: 30, coalition: "Neutral" }
            ],
            verify: (ayes, nays, presentVoting) => {
                const condAThreshold = Math.floor(545 / 2) + 1; // 273
                const condBThreshold = Math.ceil((presentVoting * 2) / 3); // 300
                const success = ayes >= condAThreshold && ayes >= condBThreshold;
                const finalThreshold = Math.max(condAThreshold, condBThreshold);
                return {
                    success: success,
                    threshold: finalThreshold,
                    formula: `Requires Ayes >= 273 (Abs. Majority) AND Ayes >= 300 (2/3 of P&V) in Parliament. Current Ayes: ${ayes}.`
                };
            }
        },
        questions: [
            {
                text: "Which of the following matters requires a Parliamentary Special Majority under Article 368 plus ratification by at least half of the State Legislatures?",
                options: [
                    "A) Abolition of the Legislative Council in a State",
                    "B) Amendment of the election process of the President of India",
                    "C) Creation of a new State",
                    "D) Changing the official language of the Union"
                ],
                correctIndex: 1,
                formula: "Presidential Election (Art. 54 & 55) is a core federal provision.",
                explanation: "Amendments changing the election process of the President (Art. 54/55) directly impact the states' representation in executive formation, requiring state ratification under Article 368(2) proviso."
            },
            {
                text: "By what type of majority must the State Legislatures pass a resolution to ratify a federal constitutional amendment bill?",
                options: [
                    "A) Simple Majority",
                    "B) Special Majority under Article 368",
                    "C) Effective Majority",
                    "D) Absolute Majority"
                ],
                correctIndex: 0,
                explanation: "Although Parliament must pass a federal amendment by a Special Majority, the State Legislatures only need to pass it by a Simple Majority of those present and voting."
            },
            {
                text: "For a federal amendment to become law, at least how many states must ratify it if India currently has 28 states?",
                options: [
                    "A) 14 states",
                    "B) 15 states",
                    "C) 10 states",
                    "D) 28 states"
                ],
                correctIndex: 0,
                formula: "Minimum states = 50% of 28 = 14.",
                explanation: "The proviso to Article 368 requires ratification by legislatures of 'not less than one-half' of the states. For 28 states, this translates to at least 14 states."
            }
        ]
    }
};

const RANKS = [
    { name: "Backbencher", xp: 0 },
    { name: "Constituent Assembly Member", xp: 200 },
    { name: "Member of Parliament", xp: 450 },
    { name: "Cabinet Minister", xp: 750 },
    { name: "Speaker of the House", xp: 1100 },
    { name: "Prime Minister", xp: 1500 }
];

// ==========================================================================
// 2. STATE MANAGEMENT
// ==========================================================================

let state = {
    xp: 0,
    rank: "Backbencher",
    unlockedChapters: [1],
    currentChapter: 1,
    currentTab: "learn",
    currentCardIndex: 0
};

// Load state from LocalStorage
function loadState() {
    const saved = localStorage.getItem("floor_test_state");
    if (saved) {
        try {
            state = JSON.parse(saved);
            // Verify unlocked chapters is an array
            if (!Array.isArray(state.unlockedChapters)) {
                state.unlockedChapters = [1];
            }
        } catch (e) {
            console.error("Failed to parse saved state, resetting...", e);
        }
    }
    updateProgressionUI();
    lockSidebarItems();
}

// Save state to LocalStorage
function saveState() {
    localStorage.setItem("floor_test_state", JSON.stringify(state));
}

// Reset state
function resetProgress() {
    state = {
        xp: 0,
        rank: "Backbencher",
        unlockedChapters: [1],
        currentChapter: 1,
        currentTab: "learn",
        currentCardIndex: 0
    };
    saveState();
    loadState();
    switchTab("learn");
    loadChapter(1);
    alert("Progression has been reset.");
}

// Update Progression Widget & check rank upgrades
function addXP(amount) {
    const oldRankIndex = RANKS.findIndex(r => r.name === state.rank);
    state.xp = Math.max(0, state.xp + amount);
    
    // Check for rank progression
    let newRank = RANKS[0].name;
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (state.xp >= RANKS[i].xp) {
            newRank = RANKS[i].name;
            break;
        }
    }

    const newRankIndex = RANKS.findIndex(r => r.name === newRank);
    const leveledUp = newRankIndex > oldRankIndex;

    state.rank = newRank;
    saveState();
    updateProgressionUI();

    if (leveledUp) {
        showLevelUpModal(RANKS[oldRankIndex].name, newRank);
    }
}

function deductXP(amount) {
    addXP(-amount);
}

function updateProgressionUI() {
    document.getElementById("user-xp").textContent = state.xp;
    document.getElementById("user-rank").textContent = state.rank;
}

function showLevelUpModal(oldRank, newRank) {
    document.getElementById("modal-old-rank").textContent = oldRank;
    document.getElementById("modal-new-rank").textContent = newRank;
    document.getElementById("new-rank-name").textContent = newRank;

    // Show banner toast
    const banner = document.getElementById("level-up-banner");
    banner.classList.remove("hidden");
    setTimeout(() => {
        banner.classList.add("hidden");
    }, 4000);

    // Show main modal overlay
    document.getElementById("level-modal-overlay").classList.remove("hidden");
}

// ==========================================================================
// 3. SPA ROUTING
// ==========================================================================

function initNavigation() {
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
    });

    // Sidebar drawer toggle
    const menuToggle = document.getElementById("menu-toggle-btn");
    const menuClose = document.getElementById("menu-close-btn");
    const sidebar = document.getElementById("chapter-sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    const toggleSidebar = () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    };

    menuToggle.addEventListener("click", toggleSidebar);
    menuClose.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    // Chapter selection inside drawer
    const chapterItems = document.querySelectorAll(".chapter-item");
    chapterItems.forEach(item => {
        item.addEventListener("click", () => {
            const chapNum = parseInt(item.getAttribute("data-chapter"), 10);
            if (state.unlockedChapters.includes(chapNum)) {
                loadChapter(chapNum);
                toggleSidebar();
            } else {
                alert("Complete the Examine phase of the previous chapter to unlock this!");
            }
        });
    });

    // Reset progression button
    document.getElementById("reset-progress-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all XP, ranks, and unlocked chapters?")) {
            resetProgress();
            toggleSidebar();
        }
    });

    // Level up modal close
    document.getElementById("level-modal-close").addEventListener("click", () => {
        document.getElementById("level-modal-overlay").classList.add("hidden");
    });

    // Play Mode Subnav toggles
    document.getElementById("btn-play-factions").onclick = () => switchPlayMode("factions");
    document.getElementById("btn-play-grid").onclick = () => switchPlayMode("grid");
}

function switchTab(tabName) {
    state.currentTab = tabName;
    saveState();

    // Update active tab buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        if (btn.getAttribute("data-tab") === tabName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Update active tab screens
    document.querySelectorAll(".tab-content").forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });

    // If play tab is selected, trigger simulator initialization
    if (tabName === "play") {
        switchPlayMode(activePlayMode);
    } else if (tabName === "examine") {
        initExamineLobby();
    }
}

function loadChapter(chapNum) {
    state.currentChapter = chapNum;
    state.currentCardIndex = 0;
    saveState();

    // Update active list elements in sidebar
    document.querySelectorAll(".chapter-item").forEach(item => {
        const itemChap = parseInt(item.getAttribute("data-chapter"), 10);
        if (itemChap === chapNum) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Update chapter markers in the layouts
    document.querySelectorAll(".current-chap-num").forEach(el => {
        el.textContent = chapNum;
    });

    const data = CHAPTERS_DATA[chapNum];
    
    // Learn Screen info updates
    document.getElementById("learn-chapter-title").textContent = data.title;
    document.getElementById("learn-chapter-subtitle").textContent = data.subtitle;

    // Load Concept cards
    loadConceptCards(data.concepts);

    // Load Historical Timelines
    loadTimeline(data.timeline);

    // Set slider boundaries and defaults depending on chapter
    initSlidersForChapter(chapNum);

    // Lock/Unlock sidebar visual representation
    lockSidebarItems();
}

function lockSidebarItems() {
    for (let i = 2; i <= 7; i++) {
        const item = document.getElementById(`chap-${i}-item`);
        if (state.unlockedChapters.includes(i)) {
            item.classList.remove("locked");
            const icon = item.querySelector(".lock-icon");
            if (icon) {
                icon.className = "fa-solid fa-chevron-right arrow-icon";
            }
        } else {
            item.classList.add("locked");
            const icon = item.querySelector(".arrow-icon");
            if (icon) {
                icon.className = "fa-solid fa-lock lock-icon";
            }
        }
    }
}

// ==========================================================================
// 4. PHASE 1: LEARN INTERFACE LOGIC
// ==========================================================================

// Concept swipe card rendering and clicking logic
function loadConceptCards(concepts) {
    const stack = document.getElementById("card-stack");
    stack.innerHTML = "";

    concepts.forEach((concept, index) => {
        const card = document.createElement("div");
        card.className = `concept-card ${index === 0 ? "" : "hidden"}`;
        card.setAttribute("data-index", index);

        card.innerHTML = `
            <div class="card-top">
                <span class="card-index">0${index + 1} / 0${concepts.length}</span>
                <span class="card-term">${concept.term}</span>
            </div>
            <div class="card-body">
                <p>${concept.desc}</p>
            </div>
            <div class="card-footer-tip">
                <i class="fa-solid fa-lightbulb"></i>
                <span>${concept.tip}</span>
            </div>
        `;
        stack.appendChild(card);
    });

    updateCardControls(concepts.length);
}

function updateCardControls(totalCards) {
    const indicator = document.getElementById("card-indicator");
    indicator.textContent = `${state.currentCardIndex + 1} / ${totalCards}`;

    const prevBtn = document.getElementById("card-prev-btn");
    const nextBtn = document.getElementById("card-next-btn");

    prevBtn.onclick = () => {
        if (state.currentCardIndex > 0) {
            animateCardTransition(state.currentCardIndex, state.currentCardIndex - 1);
            state.currentCardIndex--;
            indicator.textContent = `${state.currentCardIndex + 1} / ${totalCards}`;
        }
    };

    nextBtn.onclick = () => {
        if (state.currentCardIndex < totalCards - 1) {
            animateCardTransition(state.currentCardIndex, state.currentCardIndex + 1);
            state.currentCardIndex++;
            indicator.textContent = `${state.currentCardIndex + 1} / ${totalCards}`;
        }
    };
}

function animateCardTransition(fromIndex, toIndex) {
    const cards = document.querySelectorAll(".concept-card");
    const fromCard = cards[fromIndex];
    const toCard = cards[toIndex];

    if (fromIndex < toIndex) {
        // Swipe left and hide
        fromCard.style.transform = "translateX(-150%) rotate(-10deg)";
        setTimeout(() => {
            fromCard.classList.add("hidden");
            toCard.classList.remove("hidden");
            toCard.style.transform = "translateX(150%) rotate(10deg)";
            // trigger reflow
            toCard.offsetHeight;
            toCard.style.transform = "translateX(0) rotate(0)";
        }, 150);
    } else {
        // Swipe right and hide
        fromCard.style.transform = "translateX(150%) rotate(10deg)";
        setTimeout(() => {
            fromCard.classList.add("hidden");
            toCard.classList.remove("hidden");
            toCard.style.transform = "translateX(-150%) rotate(-10deg)";
            // trigger reflow
            toCard.offsetHeight;
            toCard.style.transform = "translateX(0) rotate(0)";
        }, 150);
    }
}

// Cinematic Historical Timeline Loader
function loadTimeline(events) {
    const container = document.getElementById("timeline-container");
    container.innerHTML = "";

    events.forEach(ev => {
        const card = document.createElement("div");
        card.className = "timeline-card";
        card.innerHTML = `
            <span class="timeline-year">${ev.year}</span>
            <h3 class="timeline-title">${ev.title}</h3>
            <p class="timeline-desc">${ev.desc}</p>
            <div class="timeline-lesson">
                <strong>Constitutional Pivot:</strong> ${ev.lesson}
            </div>
        `;
        container.appendChild(card);
    });
}

// Sliders Initialization and Chart binding
let currentChart = null;

function initSlidersForChapter(chapNum) {
    const rangeTotal = document.getElementById("range-total");
    const rangeVacant = document.getElementById("range-vacant");
    const rangeAbsent = document.getElementById("range-absent");

    // Reset default slider attributes based on chapter to avoid out-of-bound errors
    if (chapNum === 7) {
        // Special Majority + Federal
        rangeTotal.value = 545;
        rangeVacant.value = 5;
        rangeAbsent.value = 95;
    } else if (chapNum === 6) {
        // Special Majority (Article 61)
        rangeTotal.value = 545;
        rangeVacant.value = 25;
        rangeAbsent.value = 100;
    } else if (chapNum === 5) {
        // Special Majority (Article 368)
        rangeTotal.value = 545;
        rangeVacant.value = 5;
        rangeAbsent.value = 90;
    } else if (chapNum === 4) {
        // Special (Art. 249/312)
        rangeTotal.value = 245;
        rangeVacant.value = 5;
        rangeAbsent.value = 60;
    } else if (chapNum === 3) {
        // Effective Majority
        rangeTotal.value = 545;
        rangeVacant.value = 23;
        rangeAbsent.value = 120;
    } else if (chapNum === 2) {
        // Absolute Majority
        rangeTotal.value = 543;
        rangeVacant.value = 0;
        rangeAbsent.value = 0;
    } else {
        // Simple Majority
        rangeTotal.value = 545;
        rangeVacant.value = 5;
        rangeAbsent.value = 140;
    }

    updateCalculations();
}

function updateCalculations() {
    const total = parseInt(document.getElementById("range-total").value, 10);
    const vacant = parseInt(document.getElementById("range-vacant").value, 10);
    const absent = parseInt(document.getElementById("range-absent").value, 10);

    // Sync labels
    document.getElementById("val-total").textContent = total;
    document.getElementById("val-vacant").textContent = vacant;
    document.getElementById("val-absent").textContent = absent;

    // Set Maxes logically to prevent negative/broken states
    // Vacancies can't exceed 30% of total
    document.getElementById("range-vacant").max = Math.floor(total * 0.3);
    // Absentees can't exceed remaining active seats
    document.getElementById("range-absent").max = total - vacant;

    // Calculate metrics
    const effectiveStrength = total - vacant;
    const presentVoting = Math.max(0, effectiveStrength - absent);

    document.getElementById("metric-effective").textContent = effectiveStrength;
    document.getElementById("metric-present").textContent = presentVoting;

    // Calculate Threshold depending on Chapter
    let threshold = 0;
    const chap = state.currentChapter;
    const labelEl = document.getElementById("threshold-label");

    if (chap === 1) {
        // Simple Majority: > 50% of present & voting
        threshold = Math.floor(presentVoting / 2) + 1;
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(>50% of Present & Voting)</span>`;
    } else if (chap === 2) {
        // Absolute Majority: > 50% of Total Sanctioned Strength
        threshold = Math.floor(total / 2) + 1;
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(>50% of Total Strength)</span>`;
    } else if (chap === 3) {
        // Effective Majority: > 50% of effective strength
        threshold = Math.floor(effectiveStrength / 2) + 1;
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(>50% of Effective Strength)</span>`;
    } else if (chap === 4) {
        // Special (Art. 249/312): >= 2/3 of Present & Voting
        threshold = Math.ceil((presentVoting * 2) / 3);
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(>= 2/3 of Present & Voting)</span>`;
    } else if (chap === 5) {
        // Special Majority Art 368:
        const condA = Math.floor(total / 2) + 1;
        const condB = Math.ceil((presentVoting * 2) / 3);
        threshold = Math.max(condA, condB);
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(Max of Abs and 2/3 P&V)</span>`;
    } else if (chap === 6) {
        // Presidential Impeachment Art 61: >= 2/3 of Total Strength
        threshold = Math.ceil((total * 2) / 3);
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(>= 2/3 of Total Strength)</span>`;
    } else if (chap === 7) {
        // Special Majority Art 368 + Federal ratification
        const condA = Math.floor(total / 2) + 1;
        const condB = Math.ceil((presentVoting * 2) / 3);
        threshold = Math.max(condA, condB);
        labelEl.innerHTML = `Passing Threshold <span class="calc-formula">(Art. 368 Majority + Ratification by >= 50% States)</span>`;
    }

    document.getElementById("metric-threshold").textContent = threshold;

    // Render Canvas Visualizer
    renderVisualization(total, vacant, absent, presentVoting, threshold);
}

// Professional Custom Canvas Chart Drawing
function renderVisualization(total, vacant, absent, present, threshold) {
    const canvas = document.getElementById("majority-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart Configuration
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;

    // Draw background grid lines (Seaborn style)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(canvas.width - margin.right, y);
        ctx.stroke();
    }

    // Bar breakdown: Total Strength -> Vacancies -> Absentees -> Present & Voting
    // Categories and values
    const categories = [
        { label: "Total Capacity", val: total, color: "#1e293b" },
        { label: "Vacant", val: vacant, color: "#ef4444" },
        { label: "Absent/Abst.", val: absent, color: "#f59e0b" },
        { label: "Voting MPs", val: present, color: "#3b82f6" }
    ];

    // Scales
    const maxVal = Math.max(total, 1);
    const barWidth = 45;
    const gap = (chartWidth - barWidth * categories.length) / (categories.length + 1);

    // Draw Bars
    categories.forEach((cat, index) => {
        const x = margin.left + gap + index * (barWidth + gap);
        const barHeight = (cat.val / maxVal) * chartHeight;
        const y = canvas.height - margin.bottom - barHeight;

        // Draw Bar shadows
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;

        ctx.fillStyle = cat.color;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Value text on top of bar
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(cat.val, x + barWidth / 2, y - 8);

        // Label below bar (rotated if necessary, or split)
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px 'Outfit', sans-serif";
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - margin.bottom + 15);
        ctx.rotate(-Math.PI / 12);
        ctx.fillText(cat.label, 0, 0);
        ctx.restore();
    });

    // Draw Threshold Overlay line if it matches the voting spectrum
    // Let's draw it over the 'Voting MPs' column or as a line showing the passing criteria
    // Threshold line position relative to scale
    const lineY = canvas.height - margin.bottom - (threshold / maxVal) * chartHeight;

    ctx.strokeStyle = "#c59b27";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(margin.left, lineY);
    ctx.lineTo(canvas.width - margin.right, lineY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Threshold text callout
    ctx.fillStyle = "#c59b27";
    ctx.font = "bold 10px 'Space Grotesk', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Pass Threshold: ${threshold}`, margin.left + 5, lineY - 8);

    // Chart title details
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.fillText("Active Floor Test Variable Ratios", canvas.width / 2, margin.top - 15);
}

// Bind sliders listeners
function bindSliders() {
    const rangeTotal = document.getElementById("range-total");
    const rangeVacant = document.getElementById("range-vacant");
    const rangeAbsent = document.getElementById("range-absent");

    rangeTotal.addEventListener("input", updateCalculations);
    rangeVacant.addEventListener("input", updateCalculations);
    rangeAbsent.addEventListener("input", updateCalculations);
}

// ==========================================================================
// 5. PHASE 2: PLAY SIMULATOR (DRAG & DROP)
// ==========================================================================

// Play Mode State & Router
let activePlayMode = "factions"; 

function switchPlayMode(mode) {
    activePlayMode = mode;
    const btnFactions = document.getElementById("btn-play-factions");
    const btnGrid = document.getElementById("btn-play-grid");
    const viewFactions = document.getElementById("play-factions-view");
    const viewGrid = document.getElementById("play-grid-view");

    if (mode === "factions") {
        btnFactions.classList.add("active");
        btnGrid.classList.remove("active");
        viewFactions.classList.remove("hidden");
        viewGrid.classList.add("hidden");
        initSimulator();
    } else {
        btnFactions.classList.remove("active");
        btnGrid.classList.add("active");
        viewFactions.classList.remove("hidden");
        viewGrid.classList.remove("hidden");
        initGridSimulator();
    }
}

// Play Mode 1: Factions (Drag & Drop)
let simAyesTotal = 0;
let simNaysTotal = 0;
let activeScenarioData = null;

function initSimulator() {
    const scenario = CHAPTERS_DATA[state.currentChapter].simulator;
    activeScenarioData = scenario;

    document.getElementById("scenario-title").textContent = scenario.title;
    document.getElementById("scenario-description").textContent = scenario.desc;
    document.getElementById("detail-rule").textContent = `Majority Rule: ${CHAPTERS_DATA[state.currentChapter].ruleName} (${CHAPTERS_DATA[state.currentChapter].ruleFormula})`;

    const zoneAyes = document.getElementById("zone-ayes");
    const zoneNays = document.getElementById("zone-nays");
    const supply = document.getElementById("faction-supply");

    zoneAyes.innerHTML = `<div class="zone-placeholder">Drag factions here to VOTE YES</div>`;
    zoneNays.innerHTML = `<div class="zone-placeholder">Drag factions here to VOTE NO</div>`;
    supply.innerHTML = "";

    scenario.factions.forEach(f => {
        const token = document.createElement("div");
        token.className = "mp-token";
        token.id = f.id;
        token.draggable = true;
        token.setAttribute("data-size", f.size);

        token.innerHTML = `
            <div class="token-info">
                <span class="token-name">${f.name}</span>
                <span class="token-coalition">${f.coalition} Bloc</span>
            </div>
            <div class="token-count">${f.size} MPs</div>
        `;
        supply.appendChild(token);
    });

    simAyesTotal = 0;
    simNaysTotal = 0;
    updateSimulatorScores();

    document.getElementById("sim-feedback").classList.add("hidden");
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const tokens = document.querySelectorAll(".mp-token");
    const zones = document.querySelectorAll(".drop-zone, .supply-area");

    tokens.forEach(token => {
        token.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", token.id);
            setTimeout(() => {
                token.style.opacity = "0.5";
            }, 0);
        });

        token.addEventListener("dragend", () => {
            token.style.opacity = "1";
            recalculateDivisionTotals();
        });
    });

    zones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("dragover");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("dragover");
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("dragover");
            const tokenID = e.dataTransfer.getData("text/plain");
            const token = document.getElementById(tokenID);

            if (token) {
                // Remove placeholder if dropping into a zone
                const placeholder = zone.querySelector(".zone-placeholder");
                if (placeholder) {
                    placeholder.remove();
                }

                zone.appendChild(token);
                recalculateDivisionTotals();
                restorePlaceholders();
            }
        });
    });
}

function restorePlaceholders() {
    const zones = ["zone-ayes", "zone-nays"];
    zones.forEach(id => {
        const zone = document.getElementById(id);
        if (zone.children.length === 0 || (zone.children.length === 1 && zone.children[0].classList.contains("zone-placeholder"))) {
            zone.innerHTML = `<div class="zone-placeholder">Drag factions here to VOTE</div>`;
        }
    });
}

function recalculateDivisionTotals() {
    simAyesTotal = 0;
    simNaysTotal = 0;

    const ayeTokens = document.querySelectorAll("#zone-ayes .mp-token");
    ayeTokens.forEach(t => {
        simAyesTotal += parseInt(t.getAttribute("data-size"), 10);
    });

    const nayTokens = document.querySelectorAll("#zone-nays .mp-token");
    nayTokens.forEach(t => {
        simNaysTotal += parseInt(t.getAttribute("data-size"), 10);
    });

    updateSimulatorScores();
}

function updateSimulatorScores() {
    document.getElementById("sum-ayes").textContent = `Total: ${simAyesTotal} MPs`;
    document.getElementById("sum-nays").textContent = `Total: ${simNaysTotal} MPs`;
}

function submitSimulator() {
    if (!activeScenarioData) return;

    const totalCapacity = activeScenarioData.totalSeats;
    const vacancies = activeScenarioData.vacancies;
    const absentees = activeScenarioData.absent;
    const activeVotingPower = totalCapacity - vacancies - absentees;
    
    const result = activeScenarioData.verify(simAyesTotal, simNaysTotal, activeVotingPower);

    const feedbackEl = document.getElementById("sim-feedback");
    const fbIcon = document.getElementById("feedback-icon-container");
    const fbTitle = document.getElementById("feedback-title");
    const fbDesc = document.getElementById("feedback-desc");
    const fbXP = document.getElementById("feedback-xp");

    feedbackEl.classList.remove("hidden");

    if (result.success) {
        feedbackEl.className = "sim-feedback";
        fbIcon.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-green)"></i>`;
        fbTitle.textContent = "Motion Passed! Division Successful.";
        fbDesc.textContent = `Excellent calculations. ${result.formula}`;
        fbXP.textContent = "+50 XP";
        fbXP.className = "xp-earned-banner";
        addXP(50);
        playSynthSound("success");
    } else {
        feedbackEl.className = "sim-feedback error-feedback";
        fbIcon.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: var(--color-red)"></i>`;
        fbTitle.textContent = "Motion Defeated / Deficient Count!";
        fbDesc.textContent = `Constitutional requirement failed! ${result.formula}`;
        fbXP.textContent = "-25 XP";
        fbXP.className = "xp-earned-banner";
        deductXP(25);
        playSynthSound("fail");
    }

    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Play Mode 2: Individual MP Grid
let gridAyesTickedCount = 0;
let gridThresholdNeeded = 0;
let gridVotingSeatsCount = 0;

function initGridSimulator() {
    const scenario = CHAPTERS_DATA[state.currentChapter].simulator;
    const total = 100; // Representing a scaled floor of 100 cells
    
    const vacanciesCount = Math.round((scenario.vacancies / scenario.totalSeats) * total);
    const absentCount = Math.round((scenario.absent / scenario.totalSeats) * total);
    const votingCount = total - vacanciesCount - absentCount;
    gridVotingSeatsCount = votingCount;

    // Calculate dynamic threshold based on chapter formula scaled to 100
    let threshold = 0;
    const chap = state.currentChapter;

    if (chap === 1) {
        threshold = Math.floor(votingCount / 2) + 1;
    } else if (chap === 2) {
        threshold = Math.floor(total / 2) + 1; // Absolute Majority
    } else if (chap === 3) {
        const effective = total - vacanciesCount;
        threshold = Math.floor(effective / 2) + 1; // Effective Majority
    } else if (chap === 4) {
        threshold = Math.ceil((votingCount * 2) / 3); // Special Art 249/312
    } else if (chap === 5) {
        const condA = Math.floor(total / 2) + 1;
        const condB = Math.ceil((votingCount * 2) / 3);
        threshold = Math.max(condA, condB); // Special Art 368
    } else if (chap === 6) {
        threshold = Math.ceil((total * 2) / 3); // Special Art 61
    } else if (chap === 7) {
        const condA = Math.floor(total / 2) + 1;
        const condB = Math.ceil((votingCount * 2) / 3);
        threshold = Math.max(condA, condB); // Special Art 368 + Federal
    }
    
    gridThresholdNeeded = threshold;
    gridAyesTickedCount = 0;

    // UI Updates
    document.getElementById("grid-scenario-title").textContent = scenario.title + " (Individual Check)";
    document.getElementById("grid-scenario-description").textContent = `Scaled representation of Chapter ${state.currentChapter} majority rules. Out of 100 total seats: ${vacanciesCount} vacant seats, ${absentCount} absentees. Under current rules, you must click and check at least ${threshold} Present & Voting cells to pass the bill.`;

    document.getElementById("grid-ayes-count").textContent = gridAyesTickedCount;
    document.getElementById("grid-threshold-count").textContent = gridThresholdNeeded;
    document.getElementById("grid-present-count").textContent = gridVotingSeatsCount;

    // Update legend numbers in side banner
    document.getElementById("legend-count-voting").textContent = votingCount;
    document.getElementById("legend-count-absent").textContent = absentCount;
    document.getElementById("legend-count-vacant").textContent = vacanciesCount;

    document.getElementById("grid-feedback").classList.add("hidden");

    // Generate grid items
    const gridContainer = document.getElementById("parliament-mp-grid");
    gridContainer.innerHTML = "";

    const cellStatuses = [];
    for (let i = 0; i < votingCount; i++) cellStatuses.push("voting");
    for (let i = 0; i < absentCount; i++) cellStatuses.push("absent");
    for (let i = 0; i < vacanciesCount; i++) cellStatuses.push("vacant");

    cellStatuses.forEach((status, idx) => {
        const cell = document.createElement("div");
        cell.className = `mp-cell ${status}`;
        cell.setAttribute("data-index", idx);
        
        if (status === "voting") {
            cell.textContent = idx + 1;
            cell.onclick = () => {
                const allCells = gridContainer.querySelectorAll(".mp-cell.voting");
                let currentCount = 0;
                allCells.forEach(c => {
                    const cIdx = parseInt(c.getAttribute("data-index"), 10);
                    if (cIdx <= idx) {
                        c.classList.add("ticked");
                        currentCount++;
                    } else {
                        c.classList.remove("ticked");
                    }
                });
                gridAyesTickedCount = currentCount;
                document.getElementById("grid-ayes-count").textContent = gridAyesTickedCount;
                playSynthSound("click");
            };
        } else if (status === "absent") {
            cell.textContent = "A";
        } else {
            cell.textContent = "V";
        }
        gridContainer.appendChild(cell);
    });
}

function submitGridSimulator() {
    const feedbackEl = document.getElementById("grid-feedback");
    const fbIcon = document.getElementById("grid-feedback-icon-container");
    const fbTitle = document.getElementById("grid-feedback-title");
    const fbDesc = document.getElementById("grid-feedback-desc");
    const fbXP = document.getElementById("grid-feedback-xp");

    feedbackEl.classList.remove("hidden");

    const success = gridAyesTickedCount >= gridThresholdNeeded;

    if (success) {
        feedbackEl.className = "sim-feedback";
        fbIcon.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--color-green)"></i>`;
        fbTitle.textContent = "Division Assessment Passed!";
        fbDesc.textContent = `Excellent floor organization! You ticked ${gridAyesTickedCount} Ayes, meeting/exceeding the required threshold of ${gridThresholdNeeded} votes under the chapter rules.`;
        fbXP.textContent = "+50 XP";
        fbXP.className = "xp-earned-banner";
        addXP(50);
        playSynthSound("success");
    } else {
        feedbackEl.className = "sim-feedback error-feedback";
        fbIcon.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color: var(--color-red)"></i>`;
        fbTitle.textContent = "Division Failed / Deficient Count!";
        fbDesc.textContent = `Constitutional rules failed. You ticked ${gridAyesTickedCount} Ayes, but the threshold requires at least ${gridThresholdNeeded} votes to pass.`;
        fbXP.textContent = "-25 XP";
        fbXP.className = "xp-earned-banner";
        deductXP(25);
        playSynthSound("fail");
    }

    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Bind simulation buttons
function bindSimulatorControls() {
    // Play 1 (Factions)
    document.getElementById("reset-sim-btn").onclick = initSimulator;
    document.getElementById("submit-sim-btn").onclick = submitSimulator;

    // Play 2 (Grid)
    document.getElementById("reset-grid-btn").onclick = initGridSimulator;
    document.getElementById("submit-grid-btn").onclick = submitGridSimulator;
}

// ==========================================================================
// 6. PHASE 3: EXAMINE ASSESSMENT (TIME ATTACK)
// ==========================================================================

let activeQuizTimer = null;
let quizSecondsLeft = 25;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizQuestions = [];
let quizXPAccumulator = 0;

function initExamineLobby() {
    // Show lobby screen, hide active and result screen
    document.getElementById("quiz-lobby-screen").classList.remove("hidden");
    document.getElementById("quiz-active-screen").classList.add("hidden");
    document.getElementById("quiz-remedy-screen").classList.add("hidden");
    document.getElementById("quiz-results-screen").classList.add("hidden");
}

function startExam() {
    const data = CHAPTERS_DATA[state.currentChapter];
    quizQuestions = data.questions;
    currentQuestionIndex = 0;
    quizScore = 0;
    quizXPAccumulator = 0;

    // Show active screen, hide lobby
    document.getElementById("quiz-lobby-screen").classList.add("hidden");
    document.getElementById("quiz-active-screen").classList.remove("hidden");

    loadQuizQuestion(currentQuestionIndex);
}

function loadQuizQuestion(index) {
    if (index >= quizQuestions.length) {
        showQuizResults();
        return;
    }

    const q = quizQuestions[index];
    document.getElementById("current-q-num").textContent = index + 1;
    document.getElementById("question-text").textContent = q.text;

    // Update progress bar
    const progressPercent = ((index) / quizQuestions.length) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

    // Render Options
    const optionsBox = document.getElementById("options-container");
    optionsBox.innerHTML = "";

    q.options.forEach((opt, oIdx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + oIdx)}</span> ${opt}`;
        btn.onclick = () => selectOption(oIdx);
        optionsBox.appendChild(btn);
    });

    // Reset and start countdown timer
    resetQuizTimer();
}

function resetQuizTimer() {
    clearInterval(activeQuizTimer);
    quizSecondsLeft = 25;
    const timerBox = document.getElementById("quiz-timer-box");
    const secondsText = document.getElementById("quiz-timer-seconds");

    timerBox.classList.remove("timer-low");
    secondsText.textContent = quizSecondsLeft;

    activeQuizTimer = setInterval(() => {
        quizSecondsLeft--;
        secondsText.textContent = quizSecondsLeft;

        if (quizSecondsLeft <= 7) {
            timerBox.classList.add("timer-low");
        }

        if (quizSecondsLeft <= 0) {
            clearInterval(activeQuizTimer);
            handleQuizTimeout();
        }
    }, 1000);
}

function handleQuizTimeout() {
    deductXP(30);
    quizXPAccumulator -= 30;
    showRemedyScreen(false, "Timeout! You ran out of time.");
}

function selectOption(selectedIdx) {
    clearInterval(activeQuizTimer);
    const q = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedIdx === q.correctIndex;

    // Highlight selected options visually
    const options = document.querySelectorAll(".option-btn");
    options.forEach((btn, idx) => {
        if (idx === q.correctIndex) {
            btn.classList.add("correct");
        } else if (idx === selectedIdx && !isCorrect) {
            btn.classList.add("incorrect");
        }
        btn.disabled = true; // Disable all option choices
    });

    setTimeout(() => {
        if (isCorrect) {
            quizScore++;
            addXP(40);
            quizXPAccumulator += 40;
            showRemedyScreen(true);
        } else {
            deductXP(25);
            quizXPAccumulator -= 25;
            showRemedyScreen(false);
        }
    }, 600);
}

function showRemedyScreen(isCorrect, customTitle = "") {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById("quiz-active-screen").classList.add("hidden");
    const remedyOverlay = document.getElementById("quiz-remedy-screen");
    remedyOverlay.classList.remove("hidden");

    // Header styling
    const header = document.getElementById("remedy-header-status");
    const title = document.getElementById("remedy-status-title");
    const xpDiff = document.getElementById("remedy-xp-diff");

    if (isCorrect) {
        remedyOverlay.className = "quiz-feedback-overlay correct-remedy";
        header.querySelector(".status-icon").className = "fa-solid fa-circle-check status-icon text-green";
        title.textContent = customTitle || "Correct Constitutional Application!";
        xpDiff.textContent = "+40 XP Earned";
    } else {
        remedyOverlay.className = "quiz-feedback-overlay";
        header.querySelector(".status-icon").className = "fa-solid fa-circle-xmark status-icon text-red";
        title.textContent = customTitle || "Incorrect Analytical Judgment";
        xpDiff.textContent = customTitle ? "-30 XP Deducted" : "-25 XP Deducted";
    }

    // Remedy formula block & descriptive text
    document.getElementById("remedy-formula").textContent = q.formula;
    document.getElementById("remedy-explanation").textContent = q.explanation;

    document.getElementById("remedy-continue-btn").onclick = () => {
        remedyOverlay.classList.add("hidden");
        document.getElementById("quiz-active-screen").classList.remove("hidden");
        currentQuestionIndex++;
        loadQuizQuestion(currentQuestionIndex);
    };
}

function showQuizResults() {
    clearInterval(activeQuizTimer);
    document.getElementById("quiz-active-screen").classList.add("hidden");
    document.getElementById("quiz-results-screen").classList.remove("hidden");

    const pct = Math.round((quizScore / quizQuestions.length) * 100);
    document.getElementById("result-score").textContent = `${quizScore} / ${quizQuestions.length}`;
    document.getElementById("result-percentage").textContent = `${pct}%`;

    const xpTotalBox = document.getElementById("result-xp-earned");
    xpTotalBox.textContent = quizXPAccumulator >= 0 ? `+${quizXPAccumulator} XP` : `${quizXPAccumulator} XP`;
    xpTotalBox.className = quizXPAccumulator >= 0 ? "xp-result-value" : "xp-result-value text-red";

    const msgEl = document.getElementById("result-message");
    const nextBtn = document.getElementById("next-chap-btn");

    if (pct >= 80) {
        msgEl.innerHTML = `<strong>Division Assessment Passed!</strong> You have demonstrated AIR level analytical prowess and unlocked the next legislative chapter!`;
        
        // Unlock next chapter in state if not unlocked already
        const nextChap = state.currentChapter + 1;
        if (nextChap <= 7 && !state.unlockedChapters.includes(nextChap)) {
            state.unlockedChapters.push(nextChap);
            saveState();
            lockSidebarItems();
        }

        // Show next button if next chapter exists
        if (state.currentChapter < 7) {
            nextBtn.classList.remove("hidden");
            nextBtn.onclick = () => {
                loadChapter(state.currentChapter + 1);
                switchTab("learn");
            };
        } else {
            nextBtn.classList.add("hidden");
        }
    } else {
        msgEl.innerHTML = `<strong>Division Assessment Failed.</strong> You scored ${pct}%, which is below the 80% passing threshold. Review the Concept Cards and recalculate before retrying.`;
        nextBtn.classList.add("hidden");
    }

    document.getElementById("retry-exam-btn").onclick = startExam;
}

// ==========================================================================
// 7. INITIALIZATION / BOOTSTRAP
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {
    loadState();
    loadChapter(state.currentChapter);
    initNavigation();
    bindSliders();
    bindSimulatorControls();

    // Bind Quiz initiating buttons
    document.getElementById("start-exam-btn").onclick = startExam;
});
