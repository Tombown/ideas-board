var ideasBoard = angular.module('ideasBoard', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all ideas and show them
    $http.get('/api/ideas')
        .success(function(data) {
            $scope.ideas = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createIdea = function() {
        $http.post('/api/ideas', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.ideas = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // when commenting on an idea, send the comment response to the node API

     $scope.createComment = function(id) {
        $http.post('/api/ideas/' + id, $scope.formData) 
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a idea after checking it
    $scope.deleteIdea = function(id) {
        $http.delete('/api/ideas/' + id)
            .success(function(data) {
                $scope.ideas = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
