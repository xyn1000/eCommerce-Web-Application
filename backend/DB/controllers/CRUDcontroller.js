function getCRUDController(Model) {
    const controller =
    {
        create: function (obj) {
            const newObject = new Model(obj);
            return newObject.save();
        },
        read: function (id) {
            return Model.findById(id);
        },
        update: function (id, obj) {
            return Model.findByIdAndUpdate(id, obj, { new: true });
        },
        delete: function (id) {
            return Model.findByIdAndRemove(id);
        },
        readAll: function () {
            return Model.find();
        }
    };

    return controller;
};

module.exports = getCRUDController;
