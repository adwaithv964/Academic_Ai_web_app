import Dexie from 'dexie';

export const db = new Dexie('AcademicPredictorDB');

db.version(2).stores({
    predictions: '++id, date, courseName, currentGrade, predictedGrade',
    documents: '++id, name, type, date, data', // For future upload feature
    userProfile: '++id' // Singleton for user profile
});
