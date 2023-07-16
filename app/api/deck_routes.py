from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Deck, Card

deck_routes = Blueprint("decks", __name__)

@deck_routes.route('/current')
@login_required
def get_user_decks():
    decks = Deck.query.filter(Deck.user_id == current_user.get_id())

    if not decks:
        return {"errors": "No decks found"}
    if decks:
        return [deck.to_dict() for deck in decks]

@deck_routes.route('/<int:deck_id>')
def get_single_deck(deck_id):
    deck = Deck.query.get(deck_id)

    if not deck:
        return {"errors": "Deck not found"}
    if deck:
        return deck.to_dict()

@deck_routes.route('/<int:deck_id>/addCard', methods=['POST'])
def add_card(deck_id):
    deck = Deck.query.get(deck_id)
    data = request.json
    if not deck:
        return {"errors": "Deck not found"}
    if deck:
        new_card = Card(image_url = data['imageUrl'], supertype = data['supertype'], subtype = data['subtypes'][0])
        deck.cards.append(new_card)
        db.session.commit()
        return new_card.to_dict()

@deck_routes.route('/<int:deck_id>/removeCard', methods=['DELETE'])
def remove_card(deck_id):
    card = request.json
    deck = Deck.query.get(deck_id)
    # print(deck)
    current_card = Card.query.get(card['id'])
    print(current_card)
    if not deck:
        return {"errors": "Deck not found"}
    if not current_card:
        return {"errors": "Card not found"}
    if current_card:
        deck.cards.remove(current_card)
        db.session.commit()
        return current_card.to_dict()

@deck_routes.route('/create', methods=['POST'])
@login_required
def create_deck():
    data = request.json
    print(data)
    deck = Deck(name = data['name'], user_id = current_user.get_id())
    db.session.add(deck)
    db.session.commit()
    return deck.to_dict()

@deck_routes.route('/<int:deck_id>/delete', methods=['DELETE'])
def delete_deck(deck_id):
    deck = Deck.query.get(deck_id)

    if not deck:
        return {"errors": "Deck not found"}
    if deck:
        db.session.delete(deck)
        db.session.commit()
        return deck.to_dict()

@deck_routes.route('/<int:deck_id>/edit', methods=['PUT'])
def edit_deck(deck_id):
    deck = request.json
    current_deck = Deck.query.get(deck_id)

    if not current_deck:
        return {"errors": "Deck not found"}
    if current_deck:
        current_deck.name = deck['name']
        db.session.commit()
        return current_deck.to_dict()
