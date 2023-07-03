import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { db } from "./config";

export const addFileToServerStorage = async (path, filename) => {
    try {
        const response = await fetch(filename);
        const file = await response.blob();  
        const storage = await getStorage();

        const data = ref(storage, `${path}/${file._data.blobId}`);
        await uploadBytesResumable(data, file);
        
        const photoUrl = await getDownloadURL(data)
        return photoUrl;

    } catch (error) {
        console.log(error);
    };
};

export const deleteFileFromServerStorage = async (path, filename) => {
    try {
        const storage = getStorage()
        const userPhotoRef = ref(storage, `${path}/${filename}`);

        await deleteObject(userPhotoRef).then(() => {
            console.log("delete file from server strage: ", filename);
        }).catch((error) => {
            console.log("delete file from server strage error: ", error);
        });
    } catch (error) {
        console.log(error);
    };
};

export const uploadAvatarToServer = (filename) => {
    return addFileToServerStorage('avatars', filename);
};

export const deleteAvatarFromServer = (filename) => {
    return deleteFileFromServerStorage('avatars', filename);
};

export const addImageToServer = (filename) => {
    return addFileToServerStorage('postImages', filename);
};

export const deletePostImageFromServer = (filename) => {
    return deleteFileFromServerStorage('postImages', filename)
};

export const updatePostToServer = async (filename, prop) => {
    try {
        await updateDoc(doc(db, `posts`, filename), prop);
    } catch (error) {
        console.log(error)
    };
};

export const deletePostFromServer = async (filename) => {
    try {
        await deleteDoc(doc(db, `posts`, filename))
        console.log(`post ${filename} was DELETED`);
    } catch (e) {
        console.log(e);
    };
};

export const addPostToServer = async (props) => {
    try {
        const allprops = props;
        await addDoc(collection(db, `posts`), props);
    } catch (error) {
        console.log(error);
    };
};

export const addCommentToServer = async (postId, params) => {
    try {
        const docRef = query(collection(db, 'posts', postId, 'comments'));
        await addDoc(docRef, params);
    } catch (error) {
        console.log(error);
    };
};

export const subscribeAllPosts = (snapshotFunc) => {
    try {
        const docRef = query(collection(db, 'posts'), orderBy('date'));
        return onSnapshot(docRef, snapshotFunc);
    } catch (error) {
        console.log(error);
    };
};


export const subscribeUserPosts = (userId, snapshotFunc) => {
    try {
        const docRef = query(collection(db, 'posts'), where('userId', '==', userId));
        return onSnapshot(docRef, snapshotFunc);
    } catch (error) {
        console.log(error);
    };
};

export const subscribeAllComments = (postId, snapshotFunc) => {
    try {
        const docRef = query(collection(db, 'posts', postId, 'comments'), orderBy('date'));
        return onSnapshot(docRef, snapshotFunc);
    } catch (error) {
        console.log(error);
    };
};

export const putPostLengthToServer = (postId, _post) => {
    try {
        const commentRef = doc(db, 'posts', postId);
        return updateDoc(commentRef, { comments: _post.length });
    } catch (error) {
        console.log(error);
    };
};

