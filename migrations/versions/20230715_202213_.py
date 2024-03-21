"""empty message

Revision ID: 92b403708b27
Revises: 
Create Date: 2023-07-15 20:22:13.125080

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '92b403708b27'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('decks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=99), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cards',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=False),
    sa.Column('supertype', sa.String(), nullable=False),
    sa.Column('subtype', sa.String(), nullable=False),
    sa.Column('deck_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['deck_id'], ['decks.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###

    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    if environment == "production":
        op.execute(f"ALTER TABLE decks SET SCHEMA {SCHEMA};")
    if environment == "production":
        op.execute(f"ALTER TABLE cards SET SCHEMA {SCHEMA};")

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cards')
    op.drop_table('decks')
    op.drop_table('users')
    # ### end Alembic commands ###