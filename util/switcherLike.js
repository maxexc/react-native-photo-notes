import { updatePostToServer } from "../firebase/serverAPI";

export const switcherLike = (id, likes, userId) => {
    
    // Delete likes
    if (likes?.includes(userId)) {
        const filteredLikes = likes.filter((like) => like !== userId);
        updatePostToServer(id, { likes: filteredLikes });
    } else {
        updatePostToServer(id, { likes: [...likes, userId] })
    };
};