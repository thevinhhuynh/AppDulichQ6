class ProjectListTintucDiemden{
    static Init() {
        this.InitDataTintuc();
        this.InitDataDiemden();
    }

    static InitDataTintuc(_vueInstance) {
        var urlProject = APP.Server.local + '/appdata/data-list-tintuc/';
        $.ajax({
            url: urlProject,
            type: "GET",
            contentType: "json",
            success: function (resp) {
                _vueInstance.projectsTintuc = resp;
            },
            error: function(xhr, status, errors) {
                console.log(errors);
            }
        });
        return false;
    };
    static InitDataDiemden(_vueInstance) {
        var urlProject = APP.Server.local + '/appdata/data-list-diemden/';
        $.ajax({
            url: urlProject,
            type: "GET",
            contentType: "json",
            success: function (resp) {
                _vueInstance.projectsDiemden = resp;
            },
            error: function(xhr, status, errors) {
                console.log(errors);
            }
        });
        return false;
    };
}
