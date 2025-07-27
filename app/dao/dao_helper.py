from app import db
from app.models import MessageHistory


def save_message(user_id, role, content):
    message = MessageHistory(
        user_id=user_id,
        role=role,
        content=content
    )
    db.session.add(message)
    db.session.commit()


def get_recent_messages(user_id, max_pairs=5):
    return (
        MessageHistory.query
        .filter_by(user_id=user_id)
        .order_by(MessageHistory.timestamp.desc())
        .limit(max_pairs * 2)
        .all()[::-1]  # reverse for chronological order
    )
