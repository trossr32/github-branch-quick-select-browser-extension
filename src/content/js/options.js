/**
 * Remove a branch from the settings
 * @param {string} branchId - identifier for this branch
 */
var deleteBranch = async (branchId) => {
    let settings = await getSettings();

    let temp = [];

    for (let i = 0; i < settings.branches.length; i++) {
        log([branchId, settings.branches[i].id]);

        if (branchId !== settings.branches[i].id) {
            temp.push(settings.branches[i]);
        }
    }

    await log(temp);

    settings.branches = temp;

    settings = await setSettings(settings);

    await log(settings);

    $(`#input_group_${branchId}`).remove();
};

/**
 * Add a branch to the settings
 * @param {jQuery} el - the input jQuery element
 */
var saveBranch = async (el) => {
    let settings = await getSettings();

    for (let i = 0; i < settings.branches.length; i++) {
        if (settings.branches[i].id === $(el).attr('data-branch-id')) {
            settings.branches[i].name = $(el).val();
        }
    }

    settings = await setSettings(settings);
};

/**
 * Build the settings tab
 * @param {Setting} settings
 */
var initialiseBasicForm = async (settings) => {
    var existingBranches = $('<div id="existing-branches"></div>');

    $.each(settings.branches, function(i, branch) {
        existingBranches
            .append($(`<div id="input_group_${branch.id}" class="input-group mb-3" style="max-width: 400px;"></div>`)
                .append(
                    $(`<input type="text" class="form-control branch-input" placeholder="branch" aria-label="branch" data-branch-id="${branch.id}">`)
                        .val(branch.name)
                        .on('input', async (e) => {
                            await saveBranch($(e.target));
                        })
                )
                .append($('<div class="input-group-append"></div>')
                    .append(
                        $(`<button id="delete_${branch.id}" class="btn btn-outline-danger" type="button" data-branch-id="${branch.id}"><i class="fas fa-trash"></i></button>`)
                            .on('click', async (e) => {
                                await deleteBranch(this.id); // this == branch config
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
                    .on('click', async () => {
                        const id = `${Date.now()}`;

                        let settings = await getSettings();

                        settings.branches.push({id: id, name: ''});

                        settings = await setSettings(settings);

                        $('#new-branches')
                            .append($(`<div id="input_group_${id}" class="input-group mb-3" style="max-width: 400px;"></div>`)
                            .append(
                                $(`<input type="text" class="form-control branch-input" placeholder="branch" aria-label="branch" data-branch-id="${id}">`)
                                    .on('input', async (e) => {
                                        await saveBranch($(e.target));
                                    })
                            )
                            .append($('<div class="input-group-append"></div>')
                                .append(
                                    $(`<button id="delete_${id}" class="btn btn-outline-danger" type="button" data-branch-id="${id}"><i class="fas fa-trash"></i></button>`)
                                        .on('click', async (e) => {
                                            log([e.currentTarget, $(e.currentTarget)])
                                            await deleteBranch($(e.currentTarget).attr('data-branch-id'));
                                        })
                                )
                            )
                        )
                    })
            )
        );
};

/**
 * Build the debug tab
 * @param {Setting} settings
 */
var initialiseDebugForm = async (settings) => {
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
var setSettingsPropertiesFromDebugForm = async () => {
    let settings = await getSettings();

    settings.debug = $('#toggle-debug').prop('checked');

    settings = await setSettings(settings);
};

$(async () => {
    // initialise page on load
    let settings = await getSettings();

    await initialiseBasicForm(settings);

    await initialiseDebugForm(settings);

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