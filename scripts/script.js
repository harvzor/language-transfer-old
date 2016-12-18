var lt = angular.module('LanguageTransfer', ['angular-storage', 'angularMoment', 'ngAudio']);

// Simple global function that can be used to filter an array of objects by each objects id paramater.
lt.filter('getById', function() {
    return function(input, id) {
        var i=0, len=input.length;

        for (; i<len; i++) {
            if (+input[i].id == +id) {
                return input[i];
            }
        }

        return null;
    }
});

lt.factory('Data', ['$http', function($http) {
    var german;

    $http({
        methid: 'GET',
        url: '/german.json',
    }).then(function successCallback(response) {
        german = response.data;
    });

    return {
        german: german
    };
}]);

// Store data about user progress through the lessons.
lt.factory('Progress', ['store', '$filter', function(store, $filter) {
    var progress = store.get('progress');

    if (progress === null) {
        progress = [];
        store.set('progress', progress);
    }

    return {
        data: progress,
        deleteAllProgress: function() {
            progress = [];
            store.set('progress', progress);
        },
        updatePlayCount: function(lessonId) {
            if ($filter('getById')(progress, lessonId) !== null) {
                $filter('getById')(progress, lessonId).plays++;
                $filter('getById')(progress, lessonId).lastPlayed = new Date;
            } else {
                progress.push({
                    id: lessonId,
                    plays: 1,
                    lastPlayed: new Date,
                    currentPosition: 0
                });
            }

            store.set('progress', progress);
        },
        updatePositionInTrack: function(lessonId, position) {
            $filter('getById')(progress, lessonId).currentPosition = position;

            store.set('progress', progress);
        }
    };
}]);

lt.controller('MainController', ['$scope', 'Progress', function($scope, Progress) {
    $scope.deleteAllProgress = function() {
        Progress.deleteAllProgress();

        location.reload();
    };
}]);

lt.controller('LessonsController', ['$scope', '$filter', 'Progress', /*'Data',*/ '$http', 'ngAudio', function($scope, $filter, Progress, /* Data, */ $http, ngAudio) {
    $scope.progress = Progress.data;

    $scope.getProgress = function(id) {
        return $filter('getById')($scope.progress, id);
    };

    $http({
        methid: 'GET',
        url: '/german.json',
    }).then(function successCallback(response) {
        $scope.lessons = response.data;
    });

    var setTime = function(audio, position) {
        if (audio.canPlay) {
            audio.setCurrentTime(position);
        } else {
            setTimeout(function() {
                setTime(audio, position);
            }, 100);
        }
    };

    $scope.scrub = function(id, time) {
        var lesson =  $filter('getById')($scope.lessons, id);
        lesson.audio.setCurrentTime(time);
    };

    $scope.togglePlay = function(id) {
        var lesson =  $filter('getById')($scope.lessons, id);

        if (typeof lesson.audio === 'undefined') {
            lesson.audio = ngAudio.load(lesson.source);

            Progress.updatePlayCount(id);
        }

        if (lesson.audio.paused || typeof lesson.audio.paused === 'undefined') {
            lesson.audio.play();

            // If I try to set the position before the audio has loaded, it will not work.
            setTime(lesson.audio, $filter('getById')($scope.progress, id).currentPosition);
        } else {
            lesson.audio.pause();
        }

        var recordProgress = function(lessonId) {
            setTimeout(function() {
                if (!lesson.audio.paused) {

                    Progress.updatePositionInTrack(lessonId, lesson.audio.currentTime);

                    recordProgress(id);
                }
            }, 3000);
        };

        recordProgress(id);
    };
}]);

// Accordions that can be opened and closed.
lt.controller('AccordionController', ['$scope', function($scope) {
    $scope.open = false;

    $scope.toggleOpen = function() {
        $scope.open = !$scope.open;
    };
}]);
