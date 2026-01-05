// LocalStorage 유틸리티 함수들

// 투표한 게시글 ID 저장/조회
export const getVotedPosts = () => {
  try {
    const voted = localStorage.getItem('votedPosts');
    return voted ? JSON.parse(voted) : [];
  } catch (error) {
    console.error('Error reading voted posts:', error);
    return [];
  }
};

export const addVotedPost = (postId) => {
  try {
    const voted = getVotedPosts();
    if (!voted.includes(postId)) {
      voted.push(postId);
      localStorage.setItem('votedPosts', JSON.stringify(voted));
    }
  } catch (error) {
    console.error('Error adding voted post:', error);
  }
};

export const hasVoted = (postId) => {
  const voted = getVotedPosts();
  return voted.includes(postId);
};

// 사용자 인구통계 정보 저장/조회
export const getUserDemographics = () => {
  try {
    const demographics = localStorage.getItem('userDemographics');
    return demographics ? JSON.parse(demographics) : null;
  } catch (error) {
    console.error('Error reading user demographics:', error);
    return null;
  }
};

export const setUserDemographics = (demographics) => {
  try {
    localStorage.setItem('userDemographics', JSON.stringify(demographics));
  } catch (error) {
    console.error('Error saving user demographics:', error);
  }
};

// 임시 저장 글 관리
export const saveDraft = (draft) => {
  try {
    localStorage.setItem('postDraft', JSON.stringify({
      ...draft,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

export const getDraft = () => {
  try {
    const draft = localStorage.getItem('postDraft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Error reading draft:', error);
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem('postDraft');
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
};
