import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 러브트리 저장
export const saveLoveTree = async (userId: string, treeData: any) => {
  try {
    const treeRef = collection(db, 'loveTrees');
    const docRef = await addDoc(treeRef, {
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...treeData,
      likeCount: 0,
      viewCount: 0,
      isPublic: true
    });
    return docRef.id;
  } catch (error) {
    console.error('러브트리 저장 실패:', error);
    throw error;
  }
};

// 사용자별 러브트리 가져오기
export const getLoveTreesByUser = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'loveTrees'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('러브트리 조회 실패:', error);
    return [];
  }
};

// 인기 러브트리 가져오기
export const getPopularLoveTrees = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'loveTrees'),
      where('isPublic', '==', true),
      orderBy('likeCount', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('인기 러브트리 조회 실패:', error);
    return [];
  }
};

// 실시간 댓글 추가
export const addComment = async (treeId: string, userId: string, message: string, userName: string) => {
  try {
    const commentRef = collection(db, 'comments');
    await addDoc(commentRef, {
      treeId,
      userId,
      userName,
      message,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('댓글 추가 실패:', error);
    return false;
  }
};

// 실시간 댓글 구독
export const subscribeToComments = (treeId: string, callback: (comments: any[]) => void) => {
  const q = query(
    collection(db, 'comments'),
    where('treeId', '==', treeId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(comments);
  });
};

// 추천 시스템 - 새 추천 추가
export const addRecommendation = async (
  treeId: string, 
  recommendedBy: string, 
  recommendedTo: string,
  videoData: any
) => {
  try {
    const recommendationRef = collection(db, 'recommendations');
    await addDoc(recommendationRef, {
      treeId,
      recommendedBy,
      recommendedTo,
      videoData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });

    return true;
  } catch (error) {
    console.error('추천 추가 실패:', error);
    return false;
  }
};

// 사용자 포인트 업데이트
export const updateUserPoints = async (userId: string, points: number, action: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      points: increment(points),
      lastActivity: serverTimestamp(),
      [`${action}Count`]: increment(1)
    });
    return true;
  } catch (error) {
    console.error('포인트 업데이트 실패:', error);
    return false;
  }
};