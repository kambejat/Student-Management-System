"""Initial migration or updated schema

Revision ID: ab8adff5b0c8
Revises: 7a3c330b515f
Create Date: 2025-01-16 14:25:49.721891

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab8adff5b0c8'
down_revision = '7a3c330b515f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teachers', schema=None) as batch_op:
        batch_op.alter_column('class_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('phone_number',
               existing_type=sa.VARCHAR(length=15),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('teachers', schema=None) as batch_op:
        batch_op.alter_column('phone_number',
               existing_type=sa.VARCHAR(length=15),
               nullable=False)
        batch_op.alter_column('class_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
