"""empty message

Revision ID: 0abe26c0f269
Revises: fdbcf840e1be
Create Date: 2017-05-30 19:02:17.885299

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0abe26c0f269'
down_revision = 'fdbcf840e1be'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activity_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('target', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.add_column(u'activity', sa.Column('type_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'activity', 'activity_type', ['type_id'], ['id'])
    op.drop_column(u'activity', 'type')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(u'activity', sa.Column('type', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'activity', type_='foreignkey')
    op.drop_column(u'activity', 'type_id')
    op.drop_table('activity_type')
    # ### end Alembic commands ###
