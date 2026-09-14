/**
 * Department allocation algorithm.
 *
 * 1. Compute each student's effective CGPA (CGPA + affirmative-action weight
 *    for female students or students with disability).
 * 2. Sort students by effective CGPA, highest first.
 * 3. Walk the sorted list; for each student, place them into the
 *    highest-ranked preference that still has an open seat. If a choice is
 *    full, fall through to the next choice. If none have room, the student
 *    is left unassigned.
 *
 * @param {Array} students - [{ _id, cgpa, gender, disability, preferences: [code,...] }]
 * @param {Object} capacityByCode - { CODE: number of seats }
 * @param {number} weight - affirmative action bonus added to CGPA
 * @returns {Object} map of studentId (string) -> assigned department code | null
 */
function runPlacement(students, capacityByCode, weight) {
  const remaining = { ...capacityByCode };

  const eligible = students.filter((s) => s.preferences && s.preferences.length > 0);

  const effectiveCgpa = (s) => s.cgpa + (s.gender === "F" || s.disability ? weight : 0);

  const sorted = [...eligible].sort((a, b) => effectiveCgpa(b) - effectiveCgpa(a));

  const result = {};
  for (const student of sorted) {
    let placed = null;
    for (const code of student.preferences) {
      if (remaining[code] > 0) {
        placed = code;
        remaining[code] -= 1;
        break;
      }
    }
    result[String(student._id)] = placed;
  }
  return result;
}

module.exports = { runPlacement };
