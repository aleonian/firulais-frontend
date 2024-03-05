// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, InputLabel, TextField } from '@mui/material';
import { Box } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import { Grid } from '@mui/material';

import { ActionDialog } from './ActionDialog';
import { DeleteActionConfirm } from './DeleteActionConfirm';
import { ErrorSnackBar } from './ErrorSnackBar';
import { SuccessSnackbar } from './SuccessSnackbar';

import resultService from '../services/results'

export const ResultDialog = ({ open, handleClose, results, setResults, resultIndex }) => {



    const [ActionDialogOpen, setActionDialogOpen] = useState(false);
    const [DeleteActionConfirmOpen, setDeleteActionConfirmOpen] = useState(false);
    const [actions, setActions] = useState([]);
    const [actionIndex, setActionIndex] = useState(null);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // useEffect(() => {
    //     if (resultIndex !== null) {
    //         setName(results[resultIndex].name);
    //         setUrl(results[resultIndex].url);
    //         setActions(results[resultIndex].actions);
    //     }
    //     else {
    //         setName("");
    //         setUrl("");
    //         setActions([]);
    //     }
    // }, [resultIndex]);


    const newActionBtnHandler = () => {
        setActionDialogOpen(true);
    }

    function generateList() {
        if (resultIndex != null) {
            debugger;
            if (results[resultIndex].actions.length > 0) {
                return (
                    <List>
                        {
                            results[resultIndex].actions.map((action, index) => {
                                return (
                                    <ListItem key={action.name}>
                                        <ListItemText primary={action.name} />
                                        <List>
                                            {
                                                action.commands.split("\n").map(command => {
                                                    return (
                                                        <ListItem key={command}>
                                                        <ListItemText primary={command} />
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                        </List>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                )
            }
            else return (
                "No actions defined so far?"
            )
        }
    }

    const handleActionEdit = (index) => {
        setActionIndex(index);
        setActionDialogOpen(true);
    }

    const handleActionDelete = (index) => {
        setActionIndex(index);
        setDeleteActionConfirmOpen(true);
    }

    const deleteAction = () => {
        const newActions = [...actions];
        newActions.splice(actionIndex, 1);
        setActions(newActions);
        setDeleteActionConfirmOpen(false);
        setActionIndex(null);
    }

    const cleanUp = () => {
        // setActionIndex(null);
        // document.getElementById('testName').value = "";
        // document.getElementById('testUrl').value = "";
        // setName("");
        // setUrl("");
        // setActions([]);
    }
    const handleSaveBtn = (event) => {

        // event.preventDefault();

        // if (actions.length < 1) {
        //     showErrorAlertAndThenVanishIt("You must add at least one action!");
        //     return;
        // }
        // if (resultIndex === null) {
        //     if (results.find(test => test.name === name)) {
        //         showErrorAlertAndThenVanishIt("The test name must be unique!");
        //         return;
        //     }
        //     //save to site
        //     const newlyCreatedTest = { name, url, actions };
        //     testService.create(newlyCreatedTest)
        //         .then(response => {
        //             newlyCreatedTest.id = response.data.id;
        //             const newTests = [...results];
        //             newTests.push(newlyCreatedTest);
        //             setResults(newTests);
        //             cleanUp();
        //             showSuccessAlertAndThenVanishIt(`Test saved to DB! 👍`);
        //             setTimeout(() => handleClose(), 1000);
        //         })
        //         .catch(exception => {
        //             showErrorAlertAndThenVanishIt(`Error: ${exception.response ? exception.response.data.error : exception.message}`);
        //         });
        // }
        // else {
        //     const updatedTest = { name, url, actions, id: results[resultIndex].id };
        //     //TODO check that the updated test and the stored test are the same
        //     //if they are, then do not update the test in the server
        //     testService.update(updatedTest)
        //         .then(response => {
        //             const newTests = [...results];
        //             newTests[resultIndex] = updatedTest;
        //             setResults(newTests);
        //             showSuccessAlertAndThenVanishIt(`Test updated to DB! 👍`);
        //             cleanUp();
        //             setTimeout(() => handleClose(), 1000);
        //         })
        //         .catch(exception => {
        //             showErrorAlertAndThenVanishIt(`Error: ${exception.response ? exception.response.data.error : exception.message}`);
        //         });
        // }
    }

    const showSuccessAlertAndThenVanishIt = (successMessage) => {
        setSuccessMessage(successMessage);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 1500);
    }

    const showErrorAlertAndThenVanishIt = (errorMessage) => {
        setErrorMessage(errorMessage);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 1500);
    }

    return (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={() => {
            cleanUp();
            handleClose();
        }}>
            <DialogTitle>Results for test {resultIndex != null && results[resultIndex].name}</DialogTitle>
            <DialogContent>
                <Fragment>
                    <Box sx={{ minWidth: 120 }}>
                        {/* <form>
                            <TextField
                                type="text"
                                variant='outlined'
                                color='secondary'
                                label="Name"
                                onChange={e => setName(e.target.value)}
                                value={name}
                                fullWidth
                                required
                                sx={{ mb: 4 }}
                                id="testName"
                            />
                            <TextField
                                type="text"
                                variant='outlined'
                                color='secondary'
                                label="Url"
                                onChange={e => setUrl(e.target.value)}
                                value={url}
                                required
                                fullWidth
                                sx={{ mb: 4 }}
                                id="testUrl"
                            />

                            <InputLabel id="actions">Actions</InputLabel>

                            <List dense={true}>
                                {generateList()}
                            </List>

                            <Button variant="contained" sx={{ mb: 4, display: 'block' }} onClick={newActionBtnHandler}>
                                Add new action
                                <PlusOneIcon />
                            </Button>


                            <Button onClick={handleSaveBtn} variant="outlined" color="secondary" type="submit">Save</Button>
                        </form> */}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    name="testName"
                                    required
                                    fullWidth
                                    id="testName"
                                    label="Test Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="when"
                                    label="When"
                                    name="when"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    required
                                    fullWidth
                                    id="result"
                                    label="Result"
                                    name="result"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="url"
                                    label="Url"
                                    id="url"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <List dense={true}>
                                    {generateList()}
                                </List>
                            </Grid>
                        </Grid>
                    </Box>
                </Fragment>
                {/* <ActionDialog
                    open={ActionDialogOpen}
                    handleClose={() => {
                        setActionDialogOpen(false);
                    }}
                    setActions={setActions}
                    actions={actions}
                    actionIndex={actionIndex}
                    setActionIndex={setActionIndex}
                /> */}
            </DialogContent>

            {showErrorAlert && <ErrorSnackBar open={true} message={errorMessage} />}
            {showSuccessAlert && <SuccessSnackbar open={true} message={successMessage} />}
            <DeleteActionConfirm
                open={DeleteActionConfirmOpen}
                handleClose={() => { setDeleteActionConfirmOpen(false) }}
                handleYesCase={deleteAction}
            />

        </Dialog>
    );
};

