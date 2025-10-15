from backend import mongo
from datetime import datetime
from bson import ObjectId

class MoodEntry:
    collection = mongo.mindbuddy.mood_entries

    def __init__(self, user_id, mood_level, emoji, note=None, triggers=None):
        self._id = ObjectId()
        self.user_id = ObjectId(user_id) if isinstance(user_id, str) else user_id
        self.mood_level = mood_level
        self.emoji = emoji
        self.note = note
        self.triggers = triggers or []
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    @classmethod
    def find_by_user(cls, user_id):
        user_oid = ObjectId(user_id) if isinstance(user_id, str) else user_id
        return list(cls.collection.find({"user_id": user_oid}))

    @classmethod
    def find_by_id(cls, entry_id):
        return cls.collection.find_one({"_id": ObjectId(entry_id)})

    def save(self):
        self.updated_at = datetime.utcnow()
        result = self.collection.insert_one(self.to_dict())
        self._id = result.inserted_id
        return result

    def update(self, data):
        self.updated_at = datetime.utcnow()
        data["updated_at"] = self.updated_at
        return self.collection.update_one({"_id": self._id}, {"$set": data})

    def delete(self):
        return self.collection.delete_one({"_id": self._id})

    def set_triggers(self, triggers):
        """Set triggers for the mood entry"""
        if isinstance(triggers, list):
            self.triggers = triggers
        else:
            self.triggers = [triggers] if triggers else []

    def get_triggers(self):
        """Get triggers for the mood entry"""
        return self.triggers or []

    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "mood_level": self.mood_level,
            "emoji": self.emoji,
            "note": self.note,
            "triggers": self.triggers,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    @classmethod
    def from_dict(cls, data):
        entry = cls.__new__(cls)
        entry._id = data.get("_id")
        entry.user_id = data.get("user_id")
        entry.mood_level = data.get("mood_level")
        entry.emoji = data.get("emoji")
        entry.note = data.get("note")
        entry.triggers = data.get("triggers", [])
        entry.created_at = data.get("created_at")
        entry.updated_at = data.get("updated_at")
        return entry

    def __repr__(self):
        return f"<MoodEntry {self._id}: Level {self.mood_level} for User {self.user_id}>"
