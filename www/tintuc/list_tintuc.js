class ProjectListTintuc{
    static Init() {
        this.InitData();
    }

    static InitData(_vueInstance) {
        var urlProject = APP.Server.local + '/appdata/data-list-tintuc/';
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