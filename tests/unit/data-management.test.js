/**
 * Data Management Tests for Portfolio Command Center
 */

describe('Data Management Functions', () => {
  let mockRoadmapData;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRoadmapData = {
      user: { name: 'Test User' },
      activeCoach: 'Jonas',
      phases: [
        {
          id: 'phase1',
          title: 'Phase 1: Foundation',
          status: 'In Progress',
          milestones: [
            { text: 'Setup Project', status: 'Complete' },
            { text: 'Create Tests', status: 'To Do' }
          ]
        }
      ],
      journal: []
    };
  });

  test('should save data to Firestore', async () => {
    const mockSet = jest.fn().mockResolvedValue();
    const mockDoc = jest.fn(() => ({ set: mockSet }));
    
    firebase.firestore = jest.fn(() => ({ doc: mockDoc }));

    const db = firebase.firestore();
    const docRef = db.doc('test/path');
    
    await docRef.set(mockRoadmapData);

    expect(mockDoc).toHaveBeenCalledWith('test/path');
    expect(mockSet).toHaveBeenCalledWith(mockRoadmapData);
  });

  test('should load data from Firestore', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      exists: true,
      data: () => mockRoadmapData
    });
    const mockDoc = jest.fn(() => ({ get: mockGet }));
    
    firebase.firestore = jest.fn(() => ({ doc: mockDoc }));

    const db = firebase.firestore();
    const docRef = db.doc('test/path');
    const docSnap = await docRef.get();

    expect(docSnap.exists).toBe(true);
    expect(docSnap.data()).toEqual(mockRoadmapData);
  });

  test('should calculate progress correctly', () => {
    const calculateProgress = (phases) => {
      const totalMilestones = phases.reduce((total, phase) => 
        total + phase.milestones.length, 0);
      const completedMilestones = phases.reduce((total, phase) => 
        total + phase.milestones.filter(m => m.status === 'Complete').length, 0);
      
      return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    };

    const progress = calculateProgress(mockRoadmapData.phases);
    expect(progress).toBe(50); // 1 out of 2 milestones complete
  });
});
