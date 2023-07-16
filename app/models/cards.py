from .db import db


class Card(db.Model):
    __tablename__ = 'cards'

    id = db.Column(db.Integer(), primary_key = True)
    image_url = db.Column(db.String(), nullable = False)
    supertype = db.Column(db.String(), nullable = False)
    subtype = db.Column(db.String(), nullable = False)
    deck_id = db.Column(db.Integer(), db.ForeignKey("decks.id"))

    deck = db.relationship("Deck", back_populates = 'cards')

    def to_dict(self):
        return {
            "id": self.id,
            "image_url": self.image_url,
            "supertype": self.supertype,
            "subtype": self.subtype
        }
