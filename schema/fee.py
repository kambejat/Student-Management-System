from flask_marshmallow import Marshmallow
from models import FeesCollection, YearlyFees

ma = Marshmallow()

class FeesCollectionSchema(ma.Schema):
    class Meta:
        model = FeesCollection
        load_instance = True


fees_collection_schema = FeesCollectionSchema()
fees_collections_schema = FeesCollectionSchema(many=True)


class YearlyFeesSchema(ma.Schema):
    class Meta:
        model = YearlyFees
        load_instance = True

yearly_fees_schema = YearlyFeesSchema()
yearly_fees_schema_many = YearlyFeesSchema(many=True)