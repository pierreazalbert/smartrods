"""empty message

Revision ID: 086fc5ab1924
Revises: 2e917ada97a1
Create Date: 2017-06-02 16:58:29.043091

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '086fc5ab1924'
down_revision = '2e917ada97a1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('board_id', sa.Integer(), nullable=True))
    op.add_column('event', sa.Column('rods', sa.String(), nullable=False))
    op.create_foreign_key(None, 'event', 'board', ['board_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'event', type_='foreignkey')
    op.drop_column('event', 'rods')
    op.drop_column('event', 'board_id')
    # ### end Alembic commands ###
