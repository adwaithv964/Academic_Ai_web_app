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
        'A+': 10.0, 'A': 9.5, 'A-': 9.0,
        'B+': 8.5, 'B': 8.0, 'B-': 7.5,
        'C+': 7.0, 'C': 6.5, 'C-': 6.0,
        'D+': 5.5, 'D': 5.0, 'F': 0.0
    },
    '100': {
        'A+': 100, 'A': 95, 'A-': 90,
        'B+': 88, 'B': 85, 'B-': 80,
        'C+': 78, 'C': 75, 'C-': 70,
        'D+': 68, 'D': 65, 'F': 0
    }
};

export const getGradeOptions = (scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    return Object.entries(scale).map(([label, value]) => ({
        value: label,
        label: `${label} (${value})`
    }));
};

export const getGradePoint = (grade, scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    return scale[grade] || 0;
};

export const calculateGPA = (courses, scaleType = '4.0') => {
    const scale = GRADE_SCALES[scaleType] || GRADE_SCALES['4.0'];
    const totalPoints = courses.reduce((sum, course) => {
        const points = scale[course.grade] || 0;
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
            return parsed.gpaScale || '4.0';
        }
    } catch (e) {
        console.error('Error reading academic settings', e);
    }
    return '4.0';
};
