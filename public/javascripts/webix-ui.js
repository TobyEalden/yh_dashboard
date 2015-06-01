/**
 * Created by toby on 13/05/15.
 *
 * UI components.
 */

if (typeof window.centrePoint === "undefined") {
  centrePoint = {};
}

// Search form used in non-touch scenarios.
centrePoint.uiSearchForm = {
  rows: [
    {},
    { view: "search", placeholder: "search", on: { onChange: findAddress } },
    {}
  ]
};

// Header used in non-touch scenarios.
centrePoint.uiHeader = {
  height: 80,
  css: "cp_header",
  cols: [
    { view: "label", css: "cp_logo", width: 170, template: "<a target='_blank', href='http://centrepoint.org.uk/'><img src=\"/images/logo.png\" alt=\"centre point logo\" /></a>"},
    {},
    centrePoint.uiSearchForm
  ]
};

//************************************************************************
// Youth homelessness UI
//************************************************************************

// Side-bar ui for youth homelessness.
centrePoint.uiHomelessnessSideBar = {
  id: "homelessness",
  view: "scrollview",
  scroll: webix.env.touch ? "y" : false,
  body: {
    rows: [
      {
        cols: [
          {view: "label", label: "2012", width: 40, align: "right" },
          {
            view: "slider",
            id: "homelessnessDateSlider",
            step: 1,
            min: 0,
            max: aDates.length - 1,
            value: aDates.length - 1,
            title: centrePoint.getDataDateTitle,
            on: { onChange: centrePoint.onDataDateChange }
          },
          {view: "label", label: "2014", width: 40, align: "left" }
        ]
      },
      {
        borderless: true,
        autoheight: true,
        template: "html->homelessnessInfoText"
      },
      {}
    ]
  }
};

// Contains the info-graphic when a feature is clicked.
centrePoint.uiHomelessnessFeatureView = {
  id: "homelessnessFeatureView",
  view: "scrollview",
  //scroll: "y",
  body: {
        id: "homelessnessFeatures",
        view: "template",
        minWidth: 200,
        maxWidth: 1000,
        autoheight: true,
        template: centrePoint.renderFeatureInfo
  }
};

// Main map view.
centrePoint.uiHomelessnessMap = {
  id: "homelessnessMap",
  view: "google-map",
  //minWidth: 300
  minWidth: 200,
  maxWidth: 1000,
  autoheight: true
};

//************************************************************************
// Missing data UI
//************************************************************************

// Missing data side-bar.
centrePoint.uiMissingSideBar = {
  id: "missing",
  borderless: true,
  template: "html->missingDataInfoText"
};

//************************************************************************
// Unemployment UI
//************************************************************************

// UNemployment selection form, shown in the left-hand side-bar.
centrePoint.uiUnemploymentSideBar = {
    view: "form",
    id: "unemploymentForm",
    css: "cp_unemploymentForm",
    type: "clean",
    padding: 4,
    scroll: "y",
    elementsConfig: {
        gravity: 5,
        on: {onItemClick: centrePoint.unemploymentSelection},
        labelWidth: 225
    },
    elements: [
        {template: "html->unemploymentInfoText", height: 100, css: "cp_unemploymentIntro" },
        {view: "checkbox", label: "Total youth unemployment", on: {onItemClick: centrePoint.unemploymentSelectAll}},
        {
            view: "checkbox",
            id: "un_unemployment_over12m",
            name: "unemployment_over12m",
            label: "Over 12 months",
            value: 1
        },
        {
            view: "checkbox",
            id: "un_unemployment_6-12m",
            name: "unemployment_6-12m",
            label: "6 to 12 months"
        },
        {
            view: "checkbox",
            id: "un_unemployment_0-6m",
            name: "unemployment_0-6m",
            label: "Under 6 months"
        }


    ]
};

//************************************************************************
// Risk factor UI
//************************************************************************

// Risk factor selection form, shown in the left-hand side-bar.
centrePoint.uiRiskFactorsSideBar = {
  view: "form",
  id: "riskFactorsForm",
  css: "cp_riskFactorForm",
  type: "clean",
  padding: 4,
  scroll: "y",
  elementsConfig: {
      gravity: 5,
      on: {onItemClick: centrePoint.riskFactorSelection},
      labelWidth: 225
  },
  elements: [
      //{view: "checkbox", label: "Select all", on: {onItemClick: centrePoint.riskFactorSelectAll}},
      {template: "html->riskFactorInfoText", height: 60, css: "cp_riskFactorIntro" },
      {view: "button", value: "more details...", on: { onItemClick: centrePoint.onSourceClick }},
      {template: "Economy", type: "section"},
      {
          view: "checkbox",
          id: "rf_unemployment_total",
          name: "unemployment_total",
          label: "Youth unemployment"
      },
      {template: "Social care", type: "section"},
      {view: "checkbox", id: "rf_care", name: "care", label: "Children in care"},
      {template: "Environment", type: "section"},
      {view: "checkbox", id: "rf_deprivation", name: "deprivation", label: "Index of deprivation"},
      {template: "Education", type: "section"},
      {
          view: "checkbox",
          id: "rf_education_level3",
          name: "education_level3",
          label: "2 or more A levels or equivalent"
      },
      {
          view: "checkbox",
          id: "rf_education_attainment_gap",
          name: "education_attainment_gap",
          label: "Achievement gap"
      },
      {view: "checkbox", id: "rf_apprenticeship", name: "apprenticeship", label: "Apprenticeship starts"},
      {view: "checkbox", id: "rf_truancy", name: "truancy", label: "Persistent truancy"},
      {template: "Health", type: "section"},
      {view: "checkbox", id: "rf_hospital", name: "hospital", label: "Hospital admissions (under 24s)"},
      {
          view: "checkbox",
          id: "rf_mentalhealth",
          name: "mentalhealth",
          label: "Mental health problems (all ages)"
      },
      {}
  ]
};

//************************************************************************
// Main UI
//************************************************************************

centrePoint.uiMainLayout = {
  id: "rootLayout",
  maxHeight: 700,
  maxWidth: 1000,
  rows: [
    {
      type: "space",
      cols: [
        {
          minWidth: 300,
          //maxWidth: 700,
          rows: [
            {
              id: "mainHeader",
              view: "toolbar",
              height: 35,
              elements: [
                { view: "button", id: "mapButton", type: "iconButton", icon: "chevron-left", label: "map", width: 70, on: { onItemClick: centrePoint.viewChanged } },
                { view: "label", id: "featureLabel", label: "Official youth homelessness"},
                { view: "button", id: "resetButton", borderless: true, type: "iconButton", icon: "refresh", label: "reset map", width: 110, on: { onItemClick: resetMap } }
              ]

            },
            {
              id: "mainPanelView",
              view: "multiview",
              cells: [
                centrePoint.uiHomelessnessMap,
                centrePoint.uiHomelessnessFeatureView
              ]
            }
          ]
        },
        {
          view: "accordion",
          id: "viewAccordion",

          width: 310,
          type: "line",
          multi: false,
          responsive: "rootLayout",
          rows: [

            {
              header: "Official youth homelessness",
              id: "homelessnessView",
              headerAltHeight: 30,
              headerHeight: 30,
              body: centrePoint.uiHomelessnessSideBar
            },
            {
              header: "How much data is missing",
              id: "missingView",
              headerAltHeight: 30,
              headerHeight: 30,
              collapsed: true,
              body: centrePoint.uiMissingSideBar
            },
            {
              header: "Youth unemployment",
              id: "unemploymentView",
              headerAltHeight: 30,
              headerHeight: 30,
              collapsed: true,
              body: centrePoint.uiUnemploymentSideBar
            },
            {
              header: "Related factors",
              id: "riskFactorsView",
              headerAltHeight: 30,
              headerHeight: 30,
              collapsed: true,
              body: centrePoint.uiRiskFactorsSideBar
            }
          ]
        }
      ]
    }
  ]
};

//************************************************************************
// Page layout for non-touch screen devices.
//************************************************************************
centrePoint.uiPageLayout = {
  rows: [
    {
      cols: [
        {},
        {
          gravity: 4,
          rows: [
            centrePoint.uiHeader,
            centrePoint.uiMainLayout
          ]
        },
        {}
      ]
    },
    {
      height: 20
    }
  ]
};



