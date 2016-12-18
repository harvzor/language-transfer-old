var lt = angular.module('LanguageTransfer', ['angular-storage', 'angularMoment', 'ngAudio']);

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

lt.factory('Progress', ['store', function(store) {
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
            var found = false;

            angular.forEach(progress, function(value, key) {
                if (value.id === lessonId) {
                    value.plays++;
                    value.lastPlayed = new Date

                    found = true;
                }
            });

            if (!found) {
                progress.push({
                    id: lessonId,
                    plays: 1,
                    lastPlayed: new Date
                });
            }

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

lt.controller('LessonsController', ['$scope', '$filter', 'Progress', 'ngAudio', function($scope, $filter, Progress, ngAudio) {
    $scope.progress = Progress.data;

    var recordProgress = function(lesson) {

    };

    $scope.getProgress = function(id) {
        return $filter('getById')($scope.progress, id);
    };

    $scope.lessons = [
        {
            id: 1,
            summary: 'How to learn with Language Transfer',
            source: 'media/german/01.mp3',
            length: '445'
        },
        {
            id: 2,
            summary: 'Basics',
            source: 'media/german/02.mp3',
            length: '320'
        },
        {
            id: 3,
            summary: 'Ich, nicht etc',
            source: 'media/german/03.mp3',
            length: '437'
        },
        {
            id: 4,
            summary: '',
            source: 'media/german/04.mp3',
            length: '356'
        },
        {
            id: 5,
            summary: '',
            source: 'media/german/05.mp3',
            length: '372'
        },
        {
            id: 6,
            summary: '',
            source: 'media/german/06.mp3',
            length: '466'
        },
        {
            id: 7,
            summary: '',
            source: 'media/german/07.mp3',
            length: '466'
        },
        {
            id: 8,
            summary: '',
            source: 'media/german/08.mp3',
            length: '357'
        },
        {
            id: 9,
            summary: '',
            source: 'media/german/08.mp3',
            length: '344'
        },
        {
            id: 10,
            summary: '',
            source: 'media/german/09.mp3',
            length: '420'
        },
    ];

    $scope.togglePlay = function(id) {
        var lesson =  $filter('getById')($scope.lessons, id);

        if (typeof lesson.audio === 'undefined') {
            lesson.audio = ngAudio.load(lesson.source);

            Progress.updatePlayCount(id);
        }

        if (lesson.audio.paused || typeof lesson.audio.paused === 'undefined') {
            lesson.audio.play();
        } else {
            lesson.audio.pause();
        }
    };
}]);

lt.controller('AccordionController', ['$scope', function($scope) {
    $scope.open = false;

    $scope.toggleOpen = function() {
        $scope.open = !$scope.open;
    };
}]);
