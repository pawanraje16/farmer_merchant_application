import api from "./api"


export const toggleLike = async (postId, like) => {
    if(like){
        return  await api.post(`/api/v1/like/like/${postId}`)
    } else {
        return await api.delete(`api/v1/like/unlike/${postId}`)
    }
}