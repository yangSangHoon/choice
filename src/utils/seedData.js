import { supabase } from '../supabase';
import { samplePosts } from '../data/samplePosts';

/**
 * Supabase에 샘플 데이터를 추가하는 함수
 * 개발 모드에서만 사용하세요!
 */
export async function seedSampleData() {
  try {
    console.log('샘플 데이터 추가 시작...');

    for (const post of samplePosts) {
      // 검색 키워드 생성
      const searchKeywords = [
        ...post.title.toLowerCase().split(' '),
        ...post.story.toLowerCase().split(' ')
      ].filter(word => word.length > 1);

      // Supabase에 추가
      const { data, error } = await supabase
        .from('posts')
        .insert({
          category: post.category,
          title: post.title,
          story: post.story,
          side_a_label: post.side_a_label,
          side_b_label: post.side_b_label,
          votes_a: post.votes_a,
          votes_b: post.votes_b,
          search_keywords: searchKeywords
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`게시글 추가됨: ${post.title} (ID: ${data.id})`);
    }

    console.log('샘플 데이터 추가 완료!');
    return true;
  } catch (error) {
    console.error('샘플 데이터 추가 중 오류:', error);
    return false;
  }
}

// 브라우저 콘솔에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  window.seedSampleData = seedSampleData;
}
