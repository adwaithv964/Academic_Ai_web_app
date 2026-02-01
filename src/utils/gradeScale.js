export const GRADE_SCALES = {
    '4.0': {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
    },
    '5.0': {
        'A+': 5.0, 'A': 5.0, 'A-': 4.7,
        'B+': 4.3, 'B': 4.0, 'B-': 3.7,
        'C+': 3.3, 'C': 3.0, 'C-': 2.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
    },
    '10.0': {
        'O': 10.0, 'A+': 9.0, 'A': 8.5,
        'B+': 8.0, 'B': 7.5, 'C+': 7.0,
        'C': 6.0, 'P': 5.0, 'F': 0.0
    },
    '100': {
        'A+': 100, 'A': 95, 'A-': 90,
        'B+': 88, 'B': 85, 'B-': 80,
        'C+': 78, 'C': 75, 'C-': 70,
        'D+': 68, 'D': 65, 'F': 0
    },
    'CALICUT_UG_2024': { // Based on new regulations
        'O': 10.0,    // 8.5 - 10.0
        'A+': 8.49,   // 7.5 - 8.49
        'A': 7.49,    // 6.5 - 7.49
        'B+': 6.49,   // 5.5 - 6.49
        'B': 5.49,    // 5.0 - 5.49
        'C': 4.99,    // 4.5 - 4.99
        'D': 4.49,    // 4.0 - 4.49
        'F': 0.0      // Below 4.0
    }
};

// Calculate GP from marks explicitly for Calicut system
export const calculateCalicutGP = (marks) => {
    const val = parseFloat(marks);
    if (isNaN(val)) return 0;
    if (val < 40) return 0;
    // GP = (Marks / 10)
    // Example: 88% -> 8.8
    const gp = val / 10;
    return parseFloat(gp.toFixed(2));
};

export const getCalicutGrade = (marks) => {
    const val = parseFloat(marks);
    if (isNaN(val)) return 'F';

    if (val < 40) return 'F';
    if (val < 45) return 'D';
    if (val < 50) return 'C';
    if (val < 55) return 'B';
    if (val < 65) return 'B+';
    if (val < 75) return 'A';
    if (val < 85) return 'A+';
    return 'O'; // 85-100
};

export const getGradeOptions = (scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    return Object.entries(scale).map(([label, value]) => ({
        value: label,
        label: `${label} (${value})`,
        gp: value
    }));
};

export const getGradePoint = (grade, scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    return scale[grade] || 0;
};

export const calculateGPA = (courses, scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    const totalPoints = courses.reduce((sum, course) => {
        // Use explicit GP if available (for exact calculation like Calicut)
        // Otherwise fallback to Grade Mapping
        let points = 0;
        if (typeof course.gp === 'number') {
            points = course.gp;
        } else {
            points = scale[course.grade] || 0;
        }
        return sum + (points * course.credits);
    }, 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    if (totalCredits === 0) return '0.00';

    return (totalPoints / totalCredits).toFixed(2);
};

export const getStoredGpaScale = () => {
    try {
        const settings = localStorage.getItem('academicSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            return parsed.gpaScale || 'CALICUT_UG_2024';
        }
    } catch (e) {
        console.error('Error reading academic settings', e);
    }
    return 'CALICUT_UG_2024';
};
