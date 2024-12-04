import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/authContext";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { doSignOut } from "../../../firebase/auth";

const Profile = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [fullName, setFullName] = useState(''); // The user's name to display
    const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
    const [newFullName, setNewFullName] = useState(''); // State to store the new name

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (currentUser) {
                try {
                    const userProfileCollection = collection(db, 'Users');
                    const userProfileDoc = doc(userProfileCollection, currentUser.uid);
                    const userProfileDocSnap = await getDoc(userProfileDoc);

                    if (userProfileDocSnap.exists()) {
                        const profileData = userProfileDocSnap.data();
                        setUserProfile(profileData);
                        setFullName(profileData.fullName); // Store the user's name
                    } else {
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error("Error fetching user profile: ", error);
                }
            }
        };

        fetchUserProfile();
    }, [currentUser]);

    // Function to handle name update
    const handleNameUpdate = async () => {
        if (newFullName.trim()) {
            try {
                const userProfileCollection = collection(db, 'Users');
                const userProfileDoc = doc(userProfileCollection, currentUser.uid);

                // Update user's full name in Firestore
                await updateDoc(userProfileDoc, {
                    fullName: newFullName
                });

                setFullName(newFullName); // Update local state with the new name
                setIsEditing(false); // Exit edit mode
            } catch (error) {
                console.error("Error updating name: ", error);
            }
        }
    };

    return (
        <>
            <div className="profileCard max-w-3xl bg-black mx-auto text-center h-80 p-5">
            <h1 className="mb-3 uppercase font-bold text-2xl">Profile</h1>
                {userProfile && (
                    <div>
                        <p><img className="rounded-full m-auto mb-3" src={userProfile.photoURL} alt={userProfile.fullName}  /></p>
                        <div className="mb-3">
                            {isEditing ? (
                                <div>
                                    Name: <input
                                        type="text"
                                        value={newFullName}
                                        onChange={(e) => setNewFullName(e.target.value)}
                                        className="bg-transparent outline-none w-fit m-auto"
                                        
                                    />
                                    <div className="button-container flex justify-start gap-1 mt-2 m-auto w-fit">
                                    <button onClick={handleNameUpdate} className="p-1 bg-blue-300 rounded ">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="p-1 bg-red-800 rounded ">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-fit pr-6 m-auto">
                                    <p>Name: {fullName}</p>
                                    <button className="w-5 h-auto absolute invert right-0 top-0" onClick={() => {
                                        setIsEditing(true);
                                        setNewFullName(fullName);
                                    }}><img  src="https://cdn-icons-png.flaticon.com/512/2356/2356780.png" alt="" /></button>
                                    
                                </div>
                            )}
                        </div>
                        <p className="mb-3">Email: {userProfile.email}</p>
                        <button className="mb-3" onClick={() => {doSignOut().then(() => {window.location.href = '/login';});}}>Log Out</button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Profile;
