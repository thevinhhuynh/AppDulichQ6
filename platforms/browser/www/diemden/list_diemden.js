class ProjectListDiemden{
    static Init() {
        this.InitData();
    }

    static InitData(_vueInstance) {
        var urlProject = APP.Server.local + '/appdata/data-list-diemden/';
        $.ajax({
            url: urlProject,
            type: "GET",
            contentType: "json",
            success: function (resp) {
                _vueInstance.projects = resp;
            },
            error: function(xhr, status, errors) {
                console.log(errors);
            }
        });
        return false;
    };
}
