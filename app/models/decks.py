from .db import db


class Deck(db.Model):
    __tablename__ = 'decks'

    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(99), nullable = False)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable = False)

    cards = db.relationship("Card", back_populates = 'deck', cascade = "all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "cards": {card.id: card.to_dict() for card in self.cards}
        }
