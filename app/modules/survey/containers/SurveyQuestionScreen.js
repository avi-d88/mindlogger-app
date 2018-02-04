import React, {Component} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import { Container, Content, Text, Button, View, Icon, Header, Left, Right, Title, Body } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import * as Progress from 'react-native-progress';

import baseTheme from '../../../theme'
import { saveAnswer } from '../../../actions/api';
import { setAnswer } from '../../../actions/coreActions';

import SurveyTextInput from '../components/SurveyTextInput'
import SurveyBoolSelector from '../components/SurveyBoolSelector'
import SurveySingleSelector from '../components/SurveySingleSelector'
import SurveyMultiSelector from '../components/SurveyMultiSelector'
import SurveyImageSelector from '../components/SurveyImageSelector'
import SurveyTableInput from '../components/SurveyTableInput'

class SurveyQuestionScreen extends Component {
  constructor(props) {
    super(props)
  }

  onInputAnswer = (result, data, final=false) => {
    let {questionIndex, survey:{questions}, answers, setAnswer} = this.props
    let answer = {
      result,
      time: (new Date()).getTime()
    }
    if(answers.length > questionIndex) {
      answers[questionIndex] = answer
    } else {
      answers.push(answer)
    }
    setAnswer({answers})
    if(final)
      setTimeout(() => { this.nextQuestion() }, 500)
  }

  nextQuestion = () => {
    let {questionIndex, survey} = this.props
    let {questions} = survey
    questionIndex = questionIndex + 1

    if(questionIndex<questions.length) {
      Actions.replace("survey_question", { questionIndex:questionIndex})
    } else {
      Actions.replace("survey_"+ survey.mode + "_summary")
    }
    
  }

  prevQuestion = () => {
    let {questionIndex, survey} = this.props
    let {questions, answers} = survey
    questionIndex = questionIndex - 1

    if(questionIndex>=0) {
      Actions.replace("survey_question", { questionIndex:questionIndex })
    } else {
      Actions.pop()
    }
  }

  renderQuestion() {
    const { questionIndex, survey, answers} = this.props
    let question = survey.questions[questionIndex]
    let answer = answers[questionIndex] && answers[questionIndex].result
    if(survey.mode == 'basic') {
      switch(question.type) {
        case 'text':
          return (<SurveyTextInput onSelect={this.onInputAnswer} data={{question, answer}} />)
        case 'bool':
          return (<SurveyBoolSelector onSelect={this.onInputAnswer} data={{question, answer}}/>)
        case 'single_sel':
          return (<SurveySingleSelector onSelect={this.onInputAnswer} data={{question, answer}}/>)
        case 'multi_sel':
          return (<SurveyMultiSelector onSelect={this.onInputAnswer} data={{question, answer}}/>)
        case 'image_sel':
          return (<SurveyImageSelector onSelect={this.onInputAnswer} data={{question, answer}}/>)
      }
    } else {
      return (<SurveyTableInput onSelect={this.onInputAnswer} data={{question, answer}}/>)
    }
    
    
    return (
      <View>
      </View>
      )


  }

  render() {
    const { act, questionIndex, survey } = this.props
    const length = survey.questions.length
    const index = questionIndex + 1
    const progressValue = index/length
    return (
      <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => this.prevQuestion()}>
          <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body style={{flex:2}}>
            <Title>{act.title}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => this.nextQuestion()}>
          <Icon name="arrow-forward" />
          </Button>
        </Right>
      </Header>
      <Content padder style={baseTheme.content}>
        { this.renderQuestion()}
      <View padder style={{marginTop: 20}}>
        <Progress.Bar progress={progressValue} width={null} height={20}/>
        <Text style={{textAlign:'center'}}>{`${index}/${length}`}</Text>
      </View>
      </Content>
      </Container>
    )
  }
}

export default connect(state => ({
    act: state.core.act,
    survey: state.core.act.act_data,
    answers: state.core.answer && state.core.answer.answers || [],
  }),
  (dispatch) => bindActionCreators({saveAnswer, setAnswer}, dispatch)
)(SurveyQuestionScreen);