/**
 * Build the settings tab
 */
var initialiseBasicForm = function (settings) {
    var existingBranches = $('<div id="existing-branches"></div>');

    $.each(settings.branches, function(i, branch) {
        existingBranches
            .append($('<div class="input-group mb-3" style="max-width: 400px;"></div>')
                .append($('<input type="text" class="form-control branch-input" placeholder="branch" aria-label="branch">').val(branch))
                .append($('<div class="input-group-append"></div>')
                    .append(
                        $('<button class="btn btn-outline-danger" type="button"><i class="fas fa-trash"></i></button>')
                            .on('click', function() {
                                $(this).parents('.input-group').remove();

                                $('#saveMessage').hide();
                            })
                    )
                )
            )
    });

    $('#generalOptionsForm')
        .append(existingBranches)
        .append($('<div id="new-branches"></div>'))
        .append($('<div class="mt-3"></div>')
            .append(
                $('<button class="btn btn-outline-success" type="button">Add&nbsp;&nbsp;<i class="fas fa-plus"></i></button>')
                    .on('click', function() {
                        $('#new-branches')
                            .append($('<div class="input-group mb-3" style="max-width: 400px;"></div>')
                            .append($('<input type="text" class="form-control branch-input" placeholder="branch" aria-label="branch">'))
                            .append($('<div class="input-group-append"></div>')
                                .append(
                                    $('<button class="btn btn-outline-danger" type="button"><i class="fas fa-trash"></i></button>')
                                        .on('click', function() {
                                            $(this).parents('.input-group').remove();

                                            $('#saveMessage').hide();
                                        })
                                )
                            )
                        )
                    })
            )
        )
        .append($('<div class="mt-5"></div>')
            .append(
                $('<button class="btn btn-primary" type="button">Save&nbsp;&nbsp;<i class="far fa-save"></i></button>')
                    .on('click', function() {
                        getSettings(function(settings) {
                            settings.branches = [];

                            $('.branch-input').each(function() {
                                if ($(this).val != '') {
                                    settings.branches.push($(this).val());
                                }
                            });

                            setSettings(settings, function() {
                                $('#saveMessage').show();
                            });
                        });
                    })
            )
            .append($('<span">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'))
            .append(
                $('<button class="btn btn-outline-secondary" type="button">Cancel&nbsp;&nbsp;<i class="fas fa-times"></i></button>')
                    .on('click', function() {
                        window.location.reload
                    })
            )
        )
        .append($('<div id="saveMessage" class="badge bg-success badge-notify mt-3" style="display: none;">Settings have been saved!</div>'));
};

/**
 * Build the debug tab
 */
var initialiseDebugForm = function (settings) {
    var wrapper = $('<div></div>')
        .append($('<div class="row"></div>')
            .append($('<label for="toggle-debug" class="col-3" style=margin-top: 2px;">Turn on console logging</label>'))
            .append($('<div class="col"></div>')
                .append($('<input type="checkbox" id="toggle-debug">').prop('checked', settings.debug))
            )
        );

    $('#debugOptionsForm').prepend(wrapper);

    // enable toggle
    $('#toggle-debug').bootstrapToggle({
        on: 'Enabled',
        off: 'Disabled',
        onstyle: 'success',
        offstyle: 'danger',
        width: '90px',
        size: 'small'
    });

    // site enabled/disabled toggle change event
    $('#toggle-debug').on('change', setSettingsPropertiesFromDebugForm);
};

/**
 * Update settings from the debug tab form fields
 */
var setSettingsPropertiesFromDebugForm = function () {
    getSettings(function(settings) {
        settings.debug = $('#toggle-debug').prop('checked');

        setSettings(settings);
    });
};

$(function () {
    // initialise page on load
    getSettings(function(settings) {
        initialiseBasicForm(settings);
        initialiseDebugForm(settings);
    });

    // deactivate all other tabs on click. this shouldn't be required, but bootstrap 5 beta seems a bit buggy with tab deactivation.
    $('.tab-pane').on('click', function() {
        var id = $(this).attr('id');

        $('.tab-pane').each(function(t) {
            if (id == $(this).attr('id')) {
                return;
            }

            $(this).removeClass('show active');
        })
    })
});