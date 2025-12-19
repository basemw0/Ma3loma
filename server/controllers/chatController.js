const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
    try {
        const { recipientId } = req.params; 
        const senderID = req.userData.id;   
        
        const { content, mediaUrl, mediaType } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, recipientId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, recipientId],
                lastMessage: {
                    content: content || "Sent an attachment",
                    senderID: senderID,
                    read: false,
                    createdAt: new Date()
                }
            });
        }

        const newMessage = await Message.create({
            conversationID: conversation._id,
            senderID: senderID,
            content: content,
            mediaUrl: mediaUrl || "",
            mediaType: mediaType || "none",
            read: false 
        });

        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: {
                content: content || (mediaType && mediaType !== 'none' ? `Sent a ${mediaType}` : "Message"),
                senderID: senderID,
                read: false,
                createdAt: newMessage.createdAt
            }
        });

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const myId = req.userData.id; 
        
        console.log("--- DEBUG CHAT FETCH ---");
        console.log("1. Me (Hardcoded):", myId);
        console.log("2. Recipient (From URL):", recipientId);

        const conversation = await Conversation.findOne({
            participants: { $all: [myId, recipientId] }
        });

        if (!conversation) {
            console.log("❌ Conversation NOT found between these two IDs.");
            const allConvs = await Conversation.find({});
            console.log(`(DEBUG: Total conversations in DB: ${allConvs.length})`);
            return res.status(200).json([]);
        }

        console.log("✅ Conversation Found! ID:", conversation._id);

        const messages = await Message.find({ conversationID: conversation._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('senderID', 'username image');

        console.log(`3. Messages Found: ${messages.length}`);
        
        if (messages.length === 0) {
            console.log("⚠️ Conversation exists, but NO messages linked to it.");
            console.log("   Query used: { conversationID:", conversation._id, "}");
        }

        res.status(200).json(messages.reverse());

    } catch (error) {
        console.error("❌ SERVER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};


const getInbox = async (req, res) => {
    try {
        const myId = req.userData.id;
        console.log("========================================");
        console.log("🕵️‍♂️ DEBUG INBOX");
        console.log("🔑 My ID (from Token):", myId);
        console.log("   Type of My ID:", typeof myId);

        const rawConvs = await Conversation.find({ participants: myId });
        console.log(`🔎 Found ${rawConvs.length} raw matches for my ID.`);
        
        if (rawConvs.length > 0) {
            console.log("   📄 First Raw Match Participants:", rawConvs[0].participants);
        } else {
             console.log("❌ No matches found. Checking ALL conversations to see format...");
             const anyConv = await Conversation.findOne();
             if (anyConv) {
                 console.log("   👀 Random DB Conversation Participants:", anyConv.participants);
                 console.log("   👉 Do they look like my ID? If formats differ (String vs ObjectId), that's the bug.");
             }
        }

        const conversations = await Conversation.find({ participants: myId })
            .sort({ updatedAt: -1 })
            .populate('participants', 'username image');

        const inbox = conversations.reduce((acc, conv) => {
            const validParticipants = conv.participants.filter(p => p && p._id);
            
            const friend = validParticipants.find(p => p._id.toString() !== myId);

            console.log(`   🔄 Processing Chat ${conv._id}:`);
            console.log(`      - Participants Found: ${validParticipants.length}`);
            if(friend) console.log(`      - Friend Found: ${friend.username} (${friend._id})`);
            else console.log(`      - ⚠️ NO FRIEND FOUND (Am I the only one?)`);

            if (friend) {
                acc.push({
                    conversationId: conv._id,
                    friend: friend,
                    lastMessage: conv.lastMessage,
                    updatedAt: conv.updatedAt
                });
            }
            return acc;
        }, []);

        console.log(`✅ Sending ${inbox.length} chats to frontend.`);
        console.log("========================================");
        
        res.status(200).json(inbox);

    } catch (error) {
        console.error("❌ INBOX CRASH:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    sendMessage,
    getMessages,
    getInbox
};