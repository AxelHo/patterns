import React, {PropTypes} from "react";
import ReactComponent from "../../react-utils/component";
import cx from "classnames";
import styles from "./custom-package-creator.scss";
import Col from "../../00-atoms/grid/col";
import Row from "../../00-atoms/grid/row";
import SelectMenu from "../../00-atoms/forms/select-menu";
import data from "./price-table.json";
import Icon from "../../00-atoms/icons/icons";
import AnimatedNumber from "react-animated-number";
import MaterialSlider from "../../00-atoms/slider/slider";

export default class CustomPackageCreator extends ReactComponent {
    static propTypes = {
        visible: PropTypes.bool,
    };

    getInitState() {
        this.handleCBChange = ::this.onCBChange;
        this.handlePurchase = ::this.onPurchase;
        this.handleSliderChange = ::this.onSliderChange;

        return {
            dropdown1Value: "",
            dropdown2Value: "",
            dd1ErrorState: 0,
            dd2ErrorState: 0,
            tickedCheckboxes: [],
            counters: [],
            price: 0,
            selectedLanguages: [],
            showLanguageSelector: false,
            moreLanguagesBookable: false,
            serviceHours: 0,
            previousServiceHours: 0,
        };
    }

    /**
     * Allow changing the max service hours for the slider dynamically
     * @param nextProps
     * @param nextState
     * @param nextContext
     */
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.maxServiceHours = data.flatrate.serviceHourMax;
    }


    /**
     * Initialize variables and the this.state.counters array with 10 items set to 1.
     * Since it doesn't make sense to have 0 or less as a value all values should be initialized to 1.
     *
     * this.state.selectedLanguages is an array of objects.
     * All objects contain only these keys "label" and "price"
     */
    componentDidMount() {
        const tmp = [];
        for (let i = 0; i < 10; ++i)
            tmp[i] = 1;

        this.maxServiceHours = data.flatrate.serviceHourMax;
        this.setState({
            counters: tmp,
            selectedLanguages: [{label: data.custom.defaultLanguage, price: 0}],
            moreLanguagesBookable: data.custom.availableLanguages !== undefined && data.custom.availableLanguages.length > 0
        });
    }

    /**
     * Handle selection of dropdown items
     * @param e React Event
     * @param previousValue Value that was previously selected (can be supplied using this.state)
     * @param dataSource Source of the  data
     * @param dropdownSelect Whether to update the state for dropdown #1 or #2
     */
    handleDDChange(e, previousValue, dataSource, dropdownSelect) {
        let priceDiff = 0;
        if (previousValue === "") {
            priceDiff = dataSource[e.value].price;
        } else {
            priceDiff = dataSource[e.value].price - dataSource[previousValue].price;
        }

        this.setState({
            price: this.state.price + priceDiff
        });

        if (dropdownSelect === 1) {
            this.setState({
                dropdown1Value: e.value,
                dd1ErrorState: 0
            });
        } else if (dropdownSelect === 2) {
            this.setState({
                dropdown2Value: e.value,
                dd2ErrorState: 0
            });
        }
    }

    /**
     * onChange handler for checkboxes inside the checkbox list
     * @param e React Event
     */
    onCBChange(e) {
        if (e.target.checked) {
            this.setState({
                tickedCheckboxes: [...this.state.tickedCheckboxes, e.target.id],
                price: this.state.price + parseInt(e.target.value, 10)
            });
        } else {
            const tmp = this.state.tickedCheckboxes;
            const idx = tmp.indexOf(e.target.id);
            tmp.splice(idx, 1);
            this.setState({
                tickedCheckboxes: tmp,
                price: this.state.price - parseInt(e.target.value, 10)
            });
        }
    }

    /**
     * Handle the click of a counter next to a counted checkbox
     * @param e React Event
     * @param i Index of counted checkbox
     * @param price Price of the checkbox
     * @param increase Whether the counter increases(+) or decreases (-)
     * @param affectsPrice Should changing the counter affect the state price
     */
    handleCounterClick(e, i, price, increase, affectsPrice) {
        const tmp = this.state.counters;
        let multiplier = 1;
        if (increase) tmp[i]++;
        else {
            tmp[i]--;
            if (tmp[i] < 1) {
                tmp[i] = 1;
                return;
            }
            multiplier = -1;
        }
        this.setState({
            counters: tmp,
            price: this.state.price + (!!affectsPrice * (multiplier * price))
        });
    }

    /**
     * onChange handler for checkboxes in the checkbox list which feature a counter
     * @param e React Event
     * @param i Index of counted checkboxes
     * @param price Price for each checkbox
     */
    handleCountedCBChange(e, i, price) {
        if (e.target.checked) {
            this.setState({
                tickedCheckboxes: [...this.state.tickedCheckboxes, e.target.id],
                price: this.state.price + (this.state.counters[i] * price)
            });
        } else {
            const tmp = this.state.tickedCheckboxes;
            const idx = tmp.indexOf(e.target.id);
            tmp.splice(idx, 1);
            this.setState({
                tickedCheckboxes: tmp,
                price: this.state.price - (this.state.counters[i] * price)
            });
        }
    }

    /**
     * Prepare & execute purchase
     * @todo: Implement actual purchase
     */
    onPurchase() {
        if (this.state.dropdown1Value === "") {
            this.setState({
                dd1ErrorState: 1
            });
        }

        if (this.state.dropdown2Value === "") {
            this.setState({
                dd2ErrorState: 1
            });
        }
    }

    /**
     * Add a language to the selection and calculate the new price
     * @param languageLabel
     * @param price
     */
    handleAddLanguage(languageLabel, price) {
        const tmp = this.state.selectedLanguages;
        if (tmp.find((x) => x.label === languageLabel)) return;
        tmp.push({label: languageLabel, price});
        this.setState({
            selectedLanguages: tmp,
            price: this.state.price + price,
        });

        const allLanguagesBooked = data.custom.availableLanguages.reduce((a, b) => {
            if (a.label === undefined)
                return a && !!tmp.find((x) => x.label === b.label);
            else
                return !!tmp.find((x) => x.label === a.label) && !!tmp.find((x) => x.label === b.label);
        });

        if (allLanguagesBooked) this.setState({
            moreLanguagesBookable: false
        });
    }

    /**
     * Remove a language to the selection and calculate the new price
     * @param languageLabel
     */
    handleRemoveLanguage(languageLabel) {
        let tmp = this.state.selectedLanguages;
        if (!tmp.find((x) => x.label === languageLabel)) return;
        const langObj = tmp.find((x) => x.label === languageLabel);
        tmp = tmp.filter((x) => x.label !== languageLabel);
        this.setState({
            selectedLanguages: tmp,
            moreLanguagesBookable: true,
            price: this.state.price - langObj.price,
        });
    }

    /**
     * Keep track of slider state and update price accordingly
     * @param e React Event
     * @param v Slider Value
     */
    onSliderChange(e, v) {
        const newValue = Math.round(v * this.maxServiceHours);
        const diff = newValue - this.state.previousServiceHours;
        this.setState({
            serviceHours: newValue,
            price: this.state.price + (data.flatrate.serviceHourPrice * diff),
            previousServiceHours: newValue,
        });
    }

    /**
     * Creates nice-looking checkboxes that alter the state price.
     * Automatically recognized checkboxes which need a counter
     *
     * @param dataSource source of the checkboxes
     * @param onChange method that reacts to the onChange event of the checkbox
     * @param idPrefix prefix for the ID to make it unique (only needed when using multiple checkbox lists or incremental IDs would clash)
     * @returns {XML}
     */
    renderCheckboxList(dataSource, onChange, idPrefix) {
        return (
            <ul className={styles.checkboxes}>
                {dataSource.map((e, i) => {
                    return (
                        <li key={i}>
                            {!this.state.tickedCheckboxes.includes(idPrefix + i) &&
                                <Icon name="times-circle-o"/>
                            }
                            {this.state.tickedCheckboxes.includes(idPrefix + i) &&
                                <Icon name="check-circle-o" className={styles.cbChecked}/>
                            }
                            {e.labelPlural &&
                                <div className={styles.counter}>
                                    {this.state.counters[i]}
                                </div>
                            }
                            <input id={`${idPrefix}${i}`} type="checkbox" value={e.price}
                                   onChange={e.labelPlural ? (ev) => this.handleCountedCBChange(ev, i, e.price) : onChange}
                            />
                            <label htmlFor={`${idPrefix}${i}`}
                                   className={!this.state.tickedCheckboxes.includes(idPrefix + i) && styles.cbUncheckedLabel}
                            >
                                {e.labelPlural && this.state.counters[i] > 1 ? e.labelPlural : e.label}
                            </label>
                            {e.labelPlural &&
                                <div className={styles.buttonRow}>
                                    <button className={styles.checkboxButton}
                                            onClick={(ev) => this.handleCounterClick(ev, i, e.price, true, this.state.tickedCheckboxes.includes(idPrefix + i))}
                                    >
                                        <Icon name="plus"/>
                                    </button>
                                    <button className={styles.checkboxButton}
                                            onClick={(ev) => this.handleCounterClick(ev, i, e.price, false, this.state.tickedCheckboxes.includes(idPrefix + i))}
                                    >
                                        <Icon name="minus"/>
                                    </button>
                                </div>
                            }
                        </li>
                    );
                })}
            </ul>
        );
    }

    /**
     * Renders a list of selected languages with the ability to add more.
     * @returns {XML}
     */
    renderLanguageSelector() {
        return (
            <div className={styles.languageSelectorContainer}>
                <ul className={styles.languageList}>
                    {this.state.selectedLanguages.map((e, i) => {
                        return (
                            <li key={i}>
                                <img
                                    src="http://data.websitebox.com/data/applications/01/images/gadgets/translator/images/32x32/plain/flag_germany.png"
                                    alt="flag"
                                />
                                {e.label}
                                {e.label !== data.custom.defaultLanguage &&
                                <button className={styles.removeLanguageButton}
                                        onClick={() => this.handleRemoveLanguage(e.label)}
                                >
                                    {this.t("customPackage.removeLanguage")}
                                </button>
                                }
                            </li>
                        );
                    })}
                    <li className={cx(styles.addLanguageButton, !this.state.moreLanguagesBookable && styles.invisible)}
                        onClick={(e) => {
                        this.setState({
                            showLanguageSelector: !this.state.showLanguageSelector
                        });}}
                    >
                        {this.t("customPackage.addLanguagePrompt")}
                    </li>
                </ul>

                <ul className={cx(styles.languageList, !this.state.showLanguageSelector && styles.invisible)}>
                    {data.custom.availableLanguages.map((e, i) => {
                        if (this.state.selectedLanguages.find((x) => x.label === e.label)) return null;
                        return (
                            <li key={i} className={styles.addLanguageButton}
                                onClick={() => this.handleAddLanguage(e.label, e.price)}
                            >
                                <img
                                    src="http://data.websitebox.com/data/applications/01/images/gadgets/translator/images/32x32/plain/flag_germany.png"
                                    alt="flag"
                                />
                                {e.label} - {e.price}€
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    /**
     * Render a Material UI-like slider
     * @returns {XML}
     */
    renderSlider() {
        return (
            <MaterialSlider step={1/this.maxServiceHours} value={this.state.serviceHours/this.maxServiceHours}
                            onChange={this.handleSliderChange}
                            style={{width: "80%", margin: "auto"}}
            />
        );
    }

    /**
     * Main render method.
     * @returns {XML}
     */
    render() {
        return (
            <div>
                {this.props.visible && (
                    <div className={styles.packageCreator}>

                        <div className={styles.borderRadiusFix}>
                            <Row className={styles.headerRow}>
                                <Col md="6" className={styles.titleLeft}>
                                    <img src={data.custom.logo} alt="Logo"
                                         className={!data.custom.logo && styles.invisible}
                                    />
                                    <p>{this.t("customPackage.header")}</p>
                                </Col>
                                <Col md="4" mdOffset={2} className={styles.sumContainer}>
                                    <span id="sum" className={styles.sumDisplay}>
                                        <sup>€</sup>
                                        <AnimatedNumber component="text" value={this.state.price}
                                                        style={{
                                                            transition: '0.8s ease-out',
                                                            transitionProperty:
                                                                'background-color, color, opacity'
                                                        }}
                                                        duration={300}
                                                        stepPrecision={0}
                                        />
                                    </span>
                                </Col>
                            </Row>
                            <Row className={styles.contentRow}>
                                <Col md="4" className={styles.dropdownContainer}>
                                    <p>{this.t("customPackage.step1Hint")}</p>
                                    {this.state.dd1ErrorState ?
                                        <p className={styles.errorText}>{this.t("customPackage.dropdownError")}</p> : ""}
                                    <div className={this.state.dd1ErrorState && styles.selectError}>
                                        <SelectMenu defaultValue={this.state.dropdown1Value}
                                                    options={data.custom.dropdown1}
                                                    onChange={(ev) => this.handleDDChange(ev, this.state.dropdown1Value, data.custom.dropdown1, 1)}
                                        />
                                    </div>

                                    {this.state.dd2ErrorState ?
                                        <p className={styles.errorText}>{this.t("customPackage.dropdownError")}</p> : ""}
                                    <div className={this.state.dd2ErrorState && styles.selectError}>
                                        <SelectMenu defaultValue={this.state.dropdown2Value}
                                                    options={data.custom.dropdown2}
                                                    onChange={(ev) => this.handleDDChange(ev, this.state.dropdown2Value, data.custom.dropdown2, 2)}
                                        />
                                    </div>

                                    {this.renderLanguageSelector()}
                                    <div className={styles.rightBorder}></div>
                                </Col>
                                <Col md="4">
                                    <p className={styles.advisorText}>
                                        {this.t("customPackage.step2Hint")}
                                    </p>
                                    <h5 className={styles.serviceHours}>
                                        <span className={styles.serviceHourNumber}>
                                            {this.state.serviceHours}
                                        </span>
                                        Service Stunden
                                    </h5>
                                    {this.renderSlider()}
                                    {this.renderCheckboxList(data.custom.checkboxes, this.handleCBChange, 'middle')}
                                    <div className={styles.rightBorder}></div>
                                </Col>
                                <Col md="4">
                                    <p className={styles.advisorText}>
                                        {this.t("customPackage.step3Hint")}
                                    </p>
                                    {this.renderCheckboxList(data.custom.topRightCheckboxes, this.handleCBChange, 'topRight')}
                                    <div className={styles.rightMiddleHeader}>
                                        <h5>{this.t("customPackage.rightCenterHeader")}</h5>
                                    </div>
                                    {this.renderCheckboxList(data.custom.bottomRightCheckboxes, this.handleCBChange, 'bottomRight')}
                                    <div className={styles.purchaseButtonContainer}>
                                        <button className={styles.purchaseButton} onClick={this.handlePurchase}>
                                            {this.t("customPackage.purchasePrompt")}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}