
export function upgradeElementsDirective ($timeout:ng.ITimeoutService) {

    return {
        restrict: 'A',
        compile: function() {
            return {
                pre: function postLink(scope, element) {
                    $timeout(() => {
                        componentHandler.upgradeElements(element[0]);
                    }, 0);
                },
                post: function postLink(scope, element) {
                    $timeout(() => {
                        componentHandler.upgradeElements(element[0]);
                    }, 0);
                }
            };
        },
    };

}