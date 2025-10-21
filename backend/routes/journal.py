from flask import Blueprint, request, jsonify, g, current_app
from backend.models import JournalEntry
from backend.decorators import token_required
from datetime import datetime
import traceback
from bson import ObjectId

journal_bp = Blueprint("journal_bp", __name__)

# Get all entries for current user
@journal_bp.route("/entries", methods=["GET"])
@token_required
def get_entries(current_user):
    try:
        entries_data = JournalEntry.find_by_user(str(current_user._id))
        entries = [JournalEntry.from_dict(entry) for entry in entries_data]
        # Sort by created_at descending
        entries.sort(key=lambda x: x.created_at, reverse=True)
        return jsonify([entry.to_dict() for entry in entries])
    except Exception as e:
        current_app.logger.error("Get journal entries error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

# Create a new journal entry
@journal_bp.route("/entries", methods=["POST"])
@token_required
def create_entry(current_user):
    try:
        data = request.get_json()
        if not data or not data.get("content"):
            return jsonify({"message": "Content is required"}), 400

        entry = JournalEntry(
            user_id=str(current_user._id),
            title=data.get("title"),
            content=data["content"]
        )
        entry.save()
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        current_app.logger.error("Create journal entry error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

# Get a specific entry
@journal_bp.route("/entries/<entry_id>", methods=["GET"])
@token_required
def get_entry(current_user, entry_id):
    try:
        entry_data = JournalEntry.find_by_id(entry_id)
        if not entry_data or str(entry_data.get("user_id")) != str(current_user._id):
            return jsonify({"message": "Entry not found"}), 404

        entry = JournalEntry.from_dict(entry_data)
        return jsonify(entry.to_dict())
    except Exception as e:
        current_app.logger.error("Get journal entry error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

# Update an entry
@journal_bp.route("/entries/<entry_id>", methods=["PUT"])
@token_required
def update_entry(current_user, entry_id):
    try:
        entry_data = JournalEntry.find_by_id(entry_id)
        if not entry_data or str(entry_data.get("user_id")) != str(current_user._id):
            return jsonify({"message": "Entry not found"}), 404

        data = request.get_json()
        update_data = {}
        if "title" in data:
            update_data["title"] = data["title"]
        if "content" in data:
            update_data["content"] = data["content"]

        if update_data:
            entry = JournalEntry.from_dict(entry_data)
            entry.update(update_data)
            # Refresh entry data
            updated_entry_data = JournalEntry.find_by_id(entry_id)
            updated_entry = JournalEntry.from_dict(updated_entry_data)
            return jsonify(updated_entry.to_dict())
        else:
            entry = JournalEntry.from_dict(entry_data)
            return jsonify(entry.to_dict())
    except Exception as e:
        current_app.logger.error("Update journal entry error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

# Delete an entry
@journal_bp.route("/entries/<entry_id>", methods=["DELETE"])
@token_required
def delete_entry(current_user, entry_id):
    try:
        entry_data = JournalEntry.find_by_id(entry_id)
        if not entry_data or str(entry_data.get("user_id")) != str(current_user._id):
            return jsonify({"message": "Entry not found"}), 404

        entry = JournalEntry.from_dict(entry_data)
        entry.delete()
        return jsonify({"message": "Entry deleted successfully"})
    except Exception as e:
        current_app.logger.error("Delete journal entry error: %s\n%s", e, traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500
