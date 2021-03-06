"use strict"
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    updateAllOnboarding,
    startOnboarding,
    endOnboarding,
    closeNotification
} from "../../actions/usersActions";
import { DatePicker, RaisedButton } from 'material-ui';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import MetaTags from 'react-meta-tags';

class Onboarding extends Component {
    constructor(props) {
        super(props);

        let interestObjects = {};
        let goals = [];

        const user = this.props.currentUser;

        if (user) {
            const info = user.info;
            if (info) {
                const userInterests = info.interests;
                if (userInterests) {
                    const interestTypes = [
                        {
                            name: "designAndDevInterests",
                            interests: [
                                "Virtual Reality",
                                "Augmented Reality",
                                "3D Printing",
                                "UX Design",
                                "IOT",
                                "Wireframing",
                                "User Testing",
                                "A/B Testing",
                                "User Research",
                                "Electrical Engineering",
                                "Mechanical Engineering",
                                "Robotics",
                                "Mobile",
                                "Web",
                                "Lean Methodology",
                                "Responsive Design"
                            ]
                        },
                        {
                            name: "dataInterests",
                            interests: [
                                "SQL",
                                "MySQL",
                                "Database Analysis",
                                "Data Security",
                                "Machine Learning",
                                "Big Data",
                                "Data Science",
                                "Data Structures",
                                "Database Administration",
                                "Database Development"
                            ]
                        },
                        {
                            name: "softwareDevInterests",
                            interests: [
                                "Angular",
                                "React",
                                "Javascript",
                                "Java",
                                "Python",
                                "Node.js",
                                "Git",
                                "AWS",
                                "REST",
                                "C",
                                "C#",
                                "C++",
                                "HTML",
                                "CSS"
                            ]
                        },
                        {
                            name: "businessInterests",
                            interests: [
                                "Google Analytics",
                                "Project Management",
                                "Agile",
                                "Data Visualization",
                                "Data Analysis",
                                "Customer Service",
                                "Startups",
                                "Entrepreneurship",
                                "CRM",
                                "Management",
                                "Communication",
                                "Problem Solving",
                                "IT Fundamentals",
                                "Salesforce",
                                "Productivity"
                            ]
                        },
                        {
                            name: "creationAndMarketingInterests",
                            interests: [
                                "Viral Marketing",
                                "Pay Per Click",
                                "Social Media",
                                "UX",
                                "UI Design",
                                "Web Design",
                                "Photoshop",
                                "Graphic Design",
                                "SEO",
                                "Content Marketing",
                            ]
                        }
                    ];


                    // go over each type of interest (each of which is an object which contains a list of interests)
                    interestTypes.forEach(function (interestsObj, listIndex) {
                        // for each type of interest, set the interests object to a list of interest objects
                        interestObjects[interestsObj.name] = interestsObj.interests.map(function (interest) {
                            // if the user already has that interest, mark it as selected
                            let alreadyHasInterest = userInterests.some(function (userInterest) {
                                return userInterest == interest;
                            })
                            return {
                                title: interest,
                                selected: alreadyHasInterest
                            };
                        });
                    })
                }


                // GOALS
                const userGoals = info.goals;

                const potentialGoals = [
                    "Get a Full-Time Job",
                    "Find an Internship",
                    "Find Part-Time/Contract Work",
                    "Discover Your Dream Job",
                    "Explore Emerging Career Path",
                    "Learn About New Technologies",
                    "Learn New Skills",
                    "Improve Your Current Skills",
                    "Build Your Portfolio",
                    "Start a Business"
                ];

                let goalsObjects = [];

                potentialGoals.forEach(function (goal, goalIndex) {
                    let alreadyHasGoal = userGoals.some(function (userGoal) {
                        return userGoal == goal;
                    });
                    goalsObjects.push({
                        title: goal,
                        selected: alreadyHasGoal
                    });
                });

                goals = goalsObjects;
            }
        }

        let makeDateObjectFromDateString = function(dateString) {
            const BASE10 = 10;
            if (dateString && dateString != null && dateString != "" && dateString.length > 10) {
                return new Date(parseInt(dateString.substring(0, 4), BASE10),
                                parseInt(dateString.substring(5, 7), BASE10) - 1,
                                parseInt(dateString.substring(8, 10), BASE10));
            } else {
                return null;
            }
        }



        // INFO
        let location = "";
        let birthDate = null;
        let desiredJobs = "";
        let bio = "";
        let title = "";
        let gitHub = "";
        let linkedIn = "";
        let personal = "";
        let willRelocateTo = "";
        let eduInfo = [];
        let eduDates = [];

        let inSchool = false;

        if (user && user.info) {
            let info = user.info;
            location = info.location ? info.location : "";
            desiredJobs = info.desiredJobs ? info.desiredJobs : "";
            title = info.title ? info.title : "";
            bio = info.bio ? info.bio : "";
            willRelocateTo = info.willRelocateTo ? info.willRelocateTo : "";
            inSchool = info.inSchool ? info.inSchool : false;
            birthDate = makeDateObjectFromDateString(info.birthDate);
            let links = info.links;
            if (links) {
                links.forEach(function (link, linkIdx) {
                    if (link.displayString == "GitHub") {
                        gitHub = link.url;
                    } else if (link.displayString == "LinkedIn") {
                        linkedIn = link.url;
                    } else if (link.displayString == "Personal") {
                        personal = link.url;
                    }
                });
            }

            let eduArray = info.education;
            if (eduArray && eduArray.length > 0) {
                eduInfo = eduArray.map(function (edu) {
                    let endDate = {};
                    if (edu.endDate) {
                        endDate = makeDateObjectFromDateString(edu.endDate);
                    }
                    return {
                        school: edu.school ? edu.school : "",
                        majors: edu.majors ? edu.majors : "",
                        minors: edu.minors ? edu.minors : "",
                        endDate: endDate,
                    };
                });
            } else {
                // add empty edu area if none written down
                eduInfo.push({
                    school: "",
                    majors: "",
                    minors: "",
                    endDate: null,
                });
            }
        }

        this.state = {
            tabValue: "interests",
            ...interestObjects,
            currInterestArea: interestObjects.designAndDevInterests,
            goals,
            location, birthDate, desiredJobs, bio, gitHub, title,
            linkedIn, personal, willRelocateTo, eduInfo, inSchool
        }
    }


    componentDidMount() {
        //this.props.startOnboarding();
    }

    goTo(route) {
        // closes any notification
        this.props.closeNotification();
        // goes to the wanted page
        browserHistory.push(route);
        // goes to the top of the new page
        window.scrollTo(0, 0);
    }

    handleIconClick(index) {
        let chosen = undefined;
        switch (index) {
            case 1:
                chosen = this.state.designAndDevInterests;
                break;
            case 2:
                chosen = this.state.dataInterests;
                break;
            case 3:
                chosen = this.state.softwareDevInterests;
                break;
            case 4:
                chosen = this.state.creationAndMarketingInterests;
                break;
            case 5:
                chosen = this.state.businessInterests;
                break;
            default:
                break;
        }
        this.setState({
            ...this.state,
            currInterestArea: chosen
        })
    }

    handleInterestClick(interest) {
        if (this.state.currInterestArea !== undefined) {
            for (let i = 0; i < this.state.currInterestArea.length; i++) {
                let int = this.state.currInterestArea[i];
                if (int === interest) {
                    if (interest.selected) {
                        interest.selected = false;
                    } else {
                        interest.selected = true;
                    }
                    let area = this.state.currInterestArea[i];
                    this.setState({area: interest});
                    break;
                }
            }
        }
    }

    handleStep1ButtonClick() {
        const saveNow = true;
        this.saveInterests(saveNow);
        this.setState({
            ...this.state,
            tabValue: "goals"
        })
        window.scrollTo(0, 0);
    }

    saveInterests(shouldSaveImmediately) {
        let interests = [];
        for (let i = 0; i < this.state.designAndDevInterests.length; i++) {
            if (this.state.designAndDevInterests[i].selected) {
                interests.push(this.state.designAndDevInterests[i].title);
            }
        }
        for (let i = 0; i < this.state.dataInterests.length; i++) {
            if (this.state.dataInterests[i].selected) {
                interests.push(this.state.dataInterests[i].title);
            }
        }
        for (let i = 0; i < this.state.softwareDevInterests.length; i++) {
            if (this.state.softwareDevInterests[i].selected) {
                interests.push(this.state.softwareDevInterests[i].title);
            }
        }
        for (let i = 0; i < this.state.businessInterests.length; i++) {
            if (this.state.businessInterests[i].selected) {
                interests.push(this.state.businessInterests[i].title);
            }
        }
        for (let i = 0; i < this.state.creationAndMarketingInterests.length; i++) {
            if (this.state.creationAndMarketingInterests[i].selected) {
                interests.push(this.state.creationAndMarketingInterests[i].title);
            }
        }
        if (interests.length > 0) {
            // if it is saving just interests, save it here
            if (shouldSaveImmediately) {
                this.props.updateAllOnboarding(this.props.currentUser._id, this.props.currentUser.verificationToken, interests, undefined, undefined);
            }
            // otherwise return it to be saved by the caller
            else {
                return interests;
            }
        } else {
            return [];
        }
    }


    // GOALS
    handleGoalClick(goal) {
        if (this.state.goals !== undefined) {
            for (let i = 0; i < this.state.goals.length; i++) {
                let g = this.state.goals[i];
                if (goal === g) {
                    if (goal.selected) {
                        goal.selected = false;
                    } else {
                        goal.selected = true;
                    }
                    let area = this.state.goals[i];
                    this.setState({area: goal});
                    break;
                }
            }
        }
    }

    handleGoalsButtonClick(nextOrPrev) {
        const saveNow = true;
        this.saveGoals(saveNow);

        let nextTab= "info";
        if (nextOrPrev === "previous") {
            nextTab = "interests";
        }
        this.setState({
            ...this.state,
            tabValue: nextTab
        })
        window.scrollTo(0, 0);
    }

    saveGoals(shouldSaveImmediately) {
        let goals = [];
        for (let i = 0; i < this.state.goals.length; i++) {
            if (this.state.goals[i].selected) {
                goals.push(this.state.goals[i].title);
            }
        }

        if (shouldSaveImmediately) {
            this.props.updateAllOnboarding(this.props.currentUser._id, this.props.currentUser.verificationToken, undefined, goals, undefined);
        } else {
            return goals;
        }
    }


    // INFO
    handleInfoBackButtonClick() {
        const saveNow = true;
        this.saveInfo(saveNow);
        this.setState({
            ...this.state,
            tabValue: "goals"
        })
        window.scrollTo(0, 0);
    }

    handleFinishButtonClick() {
        this.saveAllInfo();
        const markOnboardingComplete = true;
        // defaults to going to discover after finishing onboarding
        let nextUrl = "/myEvaluations";
        let removeRedirectField = false;
        // if the user had somewhere else to redirect to after onboarding, go there
        if (this.props.currentUser.redirect) {
            nextUrl = this.props.currentUser.redirect;
            removeRedirectField = true;
        }
        this.props.endOnboarding(this.props.currentUser, markOnboardingComplete, removeRedirectField);
        browserHistory.push(nextUrl);
        window.scrollTo(0, 0);
    }

    saveInfo(shouldSaveImmediately) {
        const state = this.state;

        const inSchool = state.inSchool;
        const location = state.location;
        const desiredJobs = state.desiredJobs;
        const title = state.title;
        const bio = state.bio;
        const willRelocateTo = state.willRelocateTo;
        const links = [
            {url: state.gitHub, displayString: "GitHub"},
            {url: state.linkedIn, displayString: "LinkedIn"},
            {url: state.personal, displayString: "Personal"}
        ];
        let education = state.eduInfo;

        education = education.filter(function (edu) {
            return (edu.school != "" || edu.endDate != {} || edu.majors != "" || edu.minors != "");
        });

        const birthDate = this.state.birthDate;

        const updatedInfo = {
            location, birthDate, desiredJobs, title,
            bio, links, willRelocateTo, education, inSchool
        };

        if (shouldSaveImmediately) {
            this.props.updateAllOnboarding(this.props.currentUser._id, this.props.currentUser.verificationToken, undefined, undefined, updatedInfo);
        } else {
            return updatedInfo;
        }
    }

    addEducationArea() {
        let eduInfo = this.state.eduInfo.slice();
        eduInfo.push({
            school: "",
            majors: "",
            minors: "",
            endDate: {},
        })

        this.setState({
            ...this.state,
            eduInfo
        })
    }

    removeEducationArea(e) {
        const eduIdx = parseInt(e.target.attributes.eduidx.value, 10);
        const oldEduInfo = this.state.eduInfo;

        let eduInfo = oldEduInfo.slice(0, eduIdx).concat(oldEduInfo.slice(eduIdx + 1));

        this.setState({
            ...this.state,
            eduInfo
        }, function () {
        });
    }

    handleInfoInputChange(e, field) {
        const updatedField = {};
        updatedField[field] = e.target.value;

        this.setState({
            ...this.state,
            ...updatedField
        })
    }

    handleEduInputChange(e, field) {
        const eduIdx = parseInt(e.target.attributes.eduidx.value, 10);
        let eduInfo = this.state.eduInfo.slice();
        eduInfo[eduIdx][field] = e.target.value;

        this.setState({
            ...this.state,
            ...eduInfo
        })
    }

    handleEduDateChange(event, date, eduIdx) {
        let eduInfo = this.state.eduInfo.slice();
        eduInfo[eduIdx].endDate = date;

        this.setState({
            ...this.state,
            ...eduInfo
        });
    };

    handleBirthDateChange(event, date) {
        this.setState({
            ...this.state,
            birthDate: date
        });
    };


    handleCheckMarkClick() {
        this.setState({
            ...this.state,
            inSchool: !this.state.inSchool
        })
    }


    handleTabChange = (value) => {
        setTabAndSave(value);
    };

    setTabAndSave(value) {
        this.setState({
            tabValue: value,
        });
        this.saveAllInfo();
    }

    // save everything from all onboarding pages
    saveAllInfo() {
        // we want to save later
        const saveLater = false;
        const interests = this.saveInterests(saveLater);
        const goals = this.saveGoals(saveLater);
        const info = this.saveInfo(saveLater);

        this.props.updateAllOnboarding(this.props.currentUser._id, this.props.currentUser.verificationToken, interests, goals, info);
    }

    render() {
        let skipOnboarding3 = false;
        if (this.props.currentUser.redirect) {
            skipOnboarding3 = true;
        }

        const style = {
            title: {
                topTitle: {
                    margin: '20px 0 10px 0',
                    display: 'inline-block'
                },
                divider: {
                    position: 'relative',
                    marginBottom: '20px',
                },
                text: {
                    marginBottom: '30px',
                }
            },
        };

        // INTERESTS
        let interests = undefined;
        if (this.state.currInterestArea !== undefined) {
            let key = 0;
            let self = this;
            interests = this.state.currInterestArea.map(function (interest) {
                key++;
                return (
                    <li style={{verticalAlign: "top"}} key={key}>
                        {interest.selected ?
                            <div className="onboardingPage1Text2Background clickableNoUnderline noselect"
                                 onClick={() => self.handleInterestClick(interest)}>
                                <div className="font16px font12pxUnder500 onboardingPage1Text2">
                                    {interest.title}
                                </div>
                            </div>
                            :
                            <div
                                className="gradientBorderBlue center clickableNoUnderline noselect onboardingPage1Margin"
                                onClick={() => self.handleInterestClick(interest)}>
                                <div className="onboardingPage1Text3 font16px font12pxUnder500">
                                    {interest.title}
                                </div>
                            </div>
                        }
                    </li>
                );
            });
        }

        // GOALS
        let goals = undefined;
        if (this.state.goals !== undefined) {
            let key = 0;
            let self = this;
            goals = this.state.goals.map(function (goal) {
                key++;
                return (
                    <li key={key} className="noselect">
                        {goal.selected ?
                            <div className="clickableNoUnderline onboardingPage2Text2Background center"
                                 onClick={() => self.handleGoalClick(goal)}>
                                <div className="font16px font12pxUnder500 onboardingPage2Text2">
                                    {goal.title}
                                </div>
                            </div>
                            :
                            <div className="clickableNoUnderline gradientBorderPurple center onboardingPage2Margin"
                                 onClick={() => self.handleGoalClick(goal)}>
                                <div className="onboardingPage2Text3 font16px font12pxUnder500">
                                    {goal.title}
                                </div>
                            </div>
                        }
                    </li>
                );
            });
        }


        // INFO
        // make the education uls
        let eduInfo = this.state.eduInfo;
        let eduIdx = -1;
        let self = this;
        let educationUls = eduInfo.map(function (edu) {
            eduIdx++;
            const index = eduIdx;
            return (
                <div key={eduIdx + "div"}>
                    <ul className="horizCenteredList"
                        key={eduIdx + "ul"}
                        style={{marginBottom:"-10px"}}>
                        <li className="onboardingLeftInput" key={eduIdx + "left"}>
                            <span>School</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    eduidx={eduIdx}
                                    className="onboardingInputWithGradientBorder"
                                    key={eduIdx + "school"}
                                    placeholder="e.g. Columbia University"
                                    value={self.state.eduInfo[eduIdx].school}
                                    onChange={(e) => self.handleEduInputChange(e, "school")}
                                />
                            </div> <br/>
                            <span>Graduation Date</span><br/>
                            <div className="onboardingGradientBorder onboardingGradDate">
                                <div className="dp onboardingInputWithGradientBorder">
                                    <DatePicker
                                        openToYearSelection={true}
                                        eduidx={eduIdx}
                                        key={eduIdx + "date"}
                                        id={eduIdx + "date"}
                                        hintText="05/12/2017"
                                        value={self.state.eduInfo[eduIdx].endDate}
                                        onChange={(e, date) => self.handleEduDateChange(e, date, index)}
                                        className="clickableGrandChildrenInputImportant"
                                    />
                                </div>
                            </div>
                            <br/>
                        </li>
                        <li className="inputSeparator"/>
                        <li className="onboardingRightInput" key={eduIdx + "right"}>
                            <span>{"Major(s)"}</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    eduidx={eduIdx}
                                    className="onboardingInputWithGradientBorder"
                                    key={eduIdx + "majors"}
                                    placeholder="e.g. Computer Science"
                                    value={self.state.eduInfo[eduIdx].majors}
                                    onChange={(e) => self.handleEduInputChange(e, "majors")}
                                />
                            </div> <br/>
                            <span>{"Minor(s)"}</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    eduidx={eduIdx}
                                    className="onboardingInputWithGradientBorder"
                                    key={eduIdx + "minors"}
                                    placeholder="e.g. Economics"
                                    value={self.state.eduInfo[eduIdx].minors}
                                    onChange={(e) => self.handleEduInputChange(e, "minors")}
                                />
                            </div> <br/>
                        </li>
                    </ul>
                    <div className="center">
                        <span className="removeSchool clickable underline"
                                onClick={(e) => self.removeEducationArea(e)}
                                eduidx={eduIdx}
                        >
                            Remove School
                        </span>
                    </div>
                </div>
            );
        });

        let onBoardingHtml = null;
        let tabValue = this.state.tabValue;

        if (!tabValue || tabValue == "interests") {
            const interestTypes1 = [
                {interestArea: this.state.designAndDevInterests,
                 imageAltTag: "Product Design And Development",
                 pictureSrc: "/icons/Cube.png",
                 iconNumber: 1,
                 title: <b>Product Design<br/>and Development</b> },
                {interestArea: this.state.dataInterests,
                 imageAltTag: "Data",
                 pictureSrc: "/icons/Data.png",
                 iconNumber: 2,
                 title: <b>Data</b> },
                {interestArea: this.state.softwareDevInterests,
                 imageAltTag: "Software Development",
                 pictureSrc: "/icons/Computer.png",
                 iconNumber: 3,
                 title: <b>Software<br/>Development</b> }
            ]

            const interestTypes2 = [
                {interestArea: this.state.creationAndMarketingInterests,
                 imageAltTag: "Creation and Marketing",
                 pictureSrc: "/icons/Creation.png",
                 iconNumber: 4,
                 title: <b>Creation and<br/>Marketing</b>},
                {interestArea: this.state.businessInterests,
                 imageAltTag: "Business",
                 pictureSrc: "/icons/Business.png",
                 iconNumber: 5,
                 title: <b>Business</b> }
            ]


            let self = this;
            let makeLis = function(interestArrays) {
                return interestArrays.map(function(interest) {
                    return (
                        <li className="clickableNoUnderline onboardingIconLi"
                            key={"onboardingIcon" + interest.iconNumber}
                            onClick={() => self.handleIconClick(interest.iconNumber)}>
                            <div className={self.state.currInterestArea === interest.interestArea ? "gradientBorderBlue center" : "transparentBorder center"}>
                                <div style={{padding: '5px'}}>
                                    <img alt={interest.imageAltTag} src={interest.pictureSrc} className="onboardingIcons"/>
                                    <div className="font16px font12pxUnder500 center">
                                        {interest.title}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                });
            }
            const iconLis1 = makeLis(interestTypes1);
            const iconLis2 = makeLis(interestTypes2);

            onBoardingHtml =
                <div style={{marginBottom: '20px', minWidth: '100%', textAlign: 'center'}}>
                    <div className="onboardingPage1Text font40px font24pxUnder500 center" style={style.title.topTitle}>
                        Select Your
                        Interests
                    </div>
                    <div style={style.title.divider}>
                        <div className="onboardingDividerLeft" style={{bottom: "0"}}/>
                        <div className="onboardingDividerRight" style={{bottom: "0"}}/>
                    </div>
                    <div className="font14px font12pxUnder500 center" style={style.title.text}>
                        <b>What skills do you want to learn or improve?</b>
                    </div>
                    <div>
                        <ul className="horizCenteredList onboardingListContainer">
                            {iconLis1}
                        </ul>
                        <br/>
                        <ul className="horizCenteredList onboardingListContainer" style={{marginTop:"0px"}}>
                            {iconLis2}
                        </ul>
                    </div>
                    <div className="center">
                        {interests ?
                            <ul className="horizCenteredList onboardingInterestsListContainer">
                                {interests}
                            </ul>
                            : null}
                    </div>
                    <div className="center">
                        <button className="onboardingPage1Button" onClick={this.handleStep1ButtonClick.bind(this)}>
                            <div className="font20px font14pxUnder700 font12pxUnder400 onboardingPage1Text2">
                                NEXT
                            </div>
                        </button>
                    </div>
                </div>
        }

        else if (tabValue == "goals") {
            onBoardingHtml =
                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                    <div className="onboardingPage2Text font40px font24pxUnder500 center" style={style.title.topTitle}>
                        What Are Your Goals?
                    </div>
                    <div style={style.title.divider}>
                        <div className="onboarding2DividerLeft" style={{bottom: "0"}}/>
                        <div className="onboarding2DividerRight" style={{bottom: "0"}}/>
                    </div>
                    <div className="font14px font12pxUnder500 center">
                        <b>Select All That Apply.</b>
                    </div>
                    <div>
                        {goals ?
                            <ul className="onboardingGoalsListContainer">
                                {goals}
                            </ul>
                            : null}
                    </div>
                    <div className="center">
                        <button className="onboardingPage2Button" onClick={() => this.handleGoalsButtonClick("previous")}>
                            <div className="font20px font14pxUnder700 font12pxUnder400 onboardingPage1Text2">
                                BACK
                            </div>
                        </button>
                        {skipOnboarding3 ?
                            <button className="onboardingPage2Button" onClick={this.handleFinishButtonClick.bind(this)}>
                                <div className="font20px font14pxUnder700 onboardingPage1Text2">
                                    FINISH
                                </div>
                            </button>
                            :
                            <button className="onboardingPage2Button" onClick={() => this.handleGoalsButtonClick("next")}>
                                <div className="font20px font14pxUnder700 font12pxUnder400 onboardingPage1Text2">
                                    NEXT
                                </div>
                            </button>
                        }
                    </div>
                </div>
        }

        else if (tabValue == "info") {
            onBoardingHtml =
                <div style={{marginBottom: '20px', textAlign: 'center'}}>
                    <div className="onboardingPage3TextTitle font40px font24pxUnder500 center"
                         style={style.title.topTitle}>
                        Start Building Your Profile
                    </div>
                    <div style={style.title.divider}>
                        <div className="onboarding3DividerLeft" style={{bottom: "0"}}/>
                        <div className="onboarding3DividerRight" style={{bottom: "0"}}/>
                    </div>
                    <div className="font14px font12pxUnder500 center" style={style.title.text}>
                        <b>The more complete your profile, the more appealing you look to employers.</b>
                    </div>
                    <div className="center">
                        <div className="onboardingPage3Text font20px" style={{display: 'inline-block'}}><b>Personal</b>
                        </div>
                    </div>

                    <div className="horizCenteredList">
                        <li className="onboardingLeftInput">
                            <span>Date of Birth</span><br/>
                            <div className="onboardingGradientBorder" id="onboardingBirthDate">
                                <div className="dp onboardingInputWithGradientBorder">
                                    <DatePicker
                                        openToYearSelection={true}
                                        hintText="11/19/1996"
                                        value={self.state.birthDate}
                                        onChange={(e, date) => self.handleBirthDateChange(e, date)}
                                        className="clickableGrandChildrenInputImportant"
                                    />
                                </div>
                            </div> <br/>
                            <span>Location</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="City, State"
                                    value={this.state.location}
                                    onChange={(e) => this.handleInfoInputChange(e, "location")}
                                />
                                </div>
                            <br/>
                            <span>Willing to relocate to</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="e.g. San Francisco, East Coast..."
                                    value={this.state.willRelocateTo}
                                    onChange={(e) => this.handleInfoInputChange(e, "willRelocateTo")}
                                />
                            </div> <br/>
                            <span>{"Desired Job(s)"}</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="e.g. VR/AR Developer..."
                                    value={this.state.desiredJobs}
                                    onChange={(e) => this.handleInfoInputChange(e, "desiredJobs")}
                                />
                            </div> <br/>
                        </li>
                        <li className="inputSeparator"/>
                        <li className="onboardingRightInput">
                            <span>Title</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="e.g. Front End Developer"
                                    value={this.state.title}
                                    onChange={(e) => this.handleInfoInputChange(e, "title")}
                                />
                            </div> <br/>
                            <span>Links</span><br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="LinkedIn Profile"
                                    value={this.state.linkedIn}
                                    onChange={(e) => this.handleInfoInputChange(e, "linkedIn")}
                                />
                            </div> <br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="GitHub Profile"
                                    value={this.state.gitHub}
                                    onChange={(e) => this.handleInfoInputChange(e, "gitHub")}
                                />
                            </div> <br/>
                            <div className="onboardingGradientBorder">
                                <input
                                    type="text"
                                    className="onboardingInputWithGradientBorder"
                                    placeholder="Personal Site"
                                    value={this.state.personal}
                                    onChange={(e) => this.handleInfoInputChange(e, "personal")}
                                />
                            </div> <br/>
                        </li>
                    </div>

                    <div className="center" style={{marginBottom:"40px"}}>
                        <span id="onboardingBioTextareaSpan" className="font20px">Bio</span><br/>
                        <div className="onboardingGradientBorder" id="onboardingBio" style={{display:"inline-flex"}}>
                            <textarea
                                className="onboardingInputWithGradientBorder"
                                id="onboardingBioTextarea"
                                placeholder="e.g. I am a software engineer dedicated to making the world a better place through the improvement of renewable energy technology..."
                                value={this.state.bio}
                                onChange={(e) => this.handleInfoInputChange(e, "bio")}
                            />
                        </div> <br/>
                    </div>

                    <div className="center">
                        <div className="onboardingPage3Text font26px" style={{display: 'inline-block'}}><b>Education</b>
                        </div>
                    </div>

                    {educationUls}

                    <div className="center onboardingPage3 font18px font14pxUnder700 font12pxUnder400">
                        <span className="removeSchool font18px clickable underline"
                                onClick={this.addEducationArea.bind(this)}
                        >
                            Add Another School
                        </span>

                        <br/>
                        <div className="checkbox mediumCheckbox purpleCheckbox"
                             onClick={this.handleCheckMarkClick.bind(this)}>
                            <img
                                alt="Checkmark Icon"
                                className={"checkMark" + this.state.inSchool.toString()}
                                src="/icons/CheckMark.png"
                            />
                        </div>
                        I am currently in school<br/>
                    </div>

                    <div className="center">
                        <button className="onboardingPage3Button" onClick={this.handleInfoBackButtonClick.bind(this)}>
                            <div className="font20px font14pxUnder700 onboardingPage1Text2">
                                BACK
                            </div>
                        </button>
                        <button className="onboardingPage3Button" onClick={this.handleFinishButtonClick.bind(this)}>
                            <div className="font20px font14pxUnder700 onboardingPage1Text2">
                                FINISH
                            </div>
                        </button>
                    </div>
                </div>
        }

        let skipClass = "blueText underline";
        if (this.state.tabValue === "goals") {
            skipClass = "purpleText underline";
        } else if (this.state.tabValue === "info") {
            skipClass = "onboarding3PurpleText underline";
        }

        return (
            <div>
                <MetaTags>
                    <title>Onboarding | Moonshot</title>
                    <meta name="description" content="Tell us a bit about yourself so we can help you find the perfect job." />
                </MetaTags>

                <div style={{height:"65px"}}/>

                {onBoardingHtml}

                <div className={"onboardingDots center onboardingDots" + this.state.tabValue}>
                    <div
                        className="onboardingDot"
                        onClick={() => this.setTabAndSave("interests")}
                    />
                    <div
                        className="onboardingDot"
                        onClick={() => this.setTabAndSave("goals")}
                    />
                    {skipOnboarding3 ?
                        null
                        :
                        <div
                            className="onboardingDot"
                            onClick={() => this.setTabAndSave("info")}
                        />
                    }
                </div>

                <div className={"font14px center " + skipClass} style={{marginBottom:"30px"}}>
                    <i className="clickable" onClick={this.handleFinishButtonClick.bind(this)}>Skip</i>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.users.currentUser,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateAllOnboarding,
        startOnboarding,
        endOnboarding,
        closeNotification
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
