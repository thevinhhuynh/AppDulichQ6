class ProjectDetailTintuc {
    static Init() {
        this.InitData();
    }
    static InitData(_vueInstance) {
        var urlProject = APP.Server.local + '/appdata/data-detail-tintuc?id=' + _vueInstance.projectId;

        // var jsonId = urlProject.results.find(function (item){
        //     return item.id == _vueInstance.projectId;
        // });
        // var urlProjectId = JSON.stringify(jsonId);

        // console.log(urlProjectId);

        $.ajax({
            url: urlProject,
            type: "GET",
            contentType: "json",
            success: function(resp) {
                _vueInstance.projects = resp;
            },
            error: function(xhr, status, errors) {
                console.log(errors);
            }
        });
        return true;
    };
}
