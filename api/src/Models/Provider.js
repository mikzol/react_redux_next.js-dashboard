const EventEmitter = require("events");
const ValidationError = require("../Errors/ValidationError");

class Provider extends EventEmitter {
  constructor(db) {
    super();

    this.db = db;

    this.schema = new this.db.mongoose.Schema({
      _id: {
        type: this.db.mongoose.Schema.Types.ObjectId,
        auto: true
      },
      whenCreated: {
        type: Date,
        required: [true, "ERROR_FIELD_REQUIRED"]
      },
      whenUpdated: {
        type: Date,
        required: [true, "ERROR_FIELD_REQUIRED"]
      },
      name: {
        type: String,
        required: [true, "ERROR_FIELD_REQUIRED"]
      },
      profile: {
        type: this.db.mongoose.Schema.Types.Mixed,
        required: [true, "ERROR_FIELD_REQUIRED"]
      },
      accessToken: {
        type: String
      },
      refreshToken: {
        type: String
      }
    });

    this.schema
      .virtual("id")
      .get(function() {
        return this._id.toString();
      })
      .set(function(id) {
        this.set("_id", this.db.ObjectId(id));
      });

    this.schema.methods.validateField = async function({
      field,
      path,
      value,
      doThrow = true
    }) {
      if (!path) path = field;
      if (!field) field = path;
      let errors = {};
      if (_.includes(this.schema.requiredPaths(), path) && !value)
        errors[field] = { message: "ERROR_FIELD_REQUIRED" };
      if (_.keys(errors).length && doThrow)
        throw new ValidationError({ errors });
      return errors || true;
    };

    this.schema.pre("save", function() {
      this.whenUpdated = Date.now();
    });

    this.model = this.db.mongoose.model("Provider", this.schema);
  }

  // eslint-disable-next-line lodash/prefer-constant
  static get $provides() {
    return "model.provider";
  }

  // eslint-disable-next-line lodash/prefer-constant
  static get $requires() {
    return ["db"];
  }

  // eslint-disable-next-line lodash/prefer-constant
  static get $lifecycle() {
    return "singleton";
  }

  async init() {}
}

module.exports = Provider;
