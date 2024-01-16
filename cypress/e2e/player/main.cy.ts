// import { Context, PermissionLevel } from '@graasp/sdk';

// import {
//   MCQ_QUESTION_CY,
//   buildDataCy,
//   makeMcqAnswersCy,
//   makeMcqMultipleAnswersCy,
// } from '../../../src/config/selectors';
// import {
//   ANSWERS_SETTING,
//   ANSWERS_SETTING_MULTI_ANSWERS,
//   QUESTION_SETTING,
// } from '../../fixtures/appSettings';

// describe('Player View configured for single answer', () => {
//   beforeEach(() => {
//     cy.setUpApi(
//       {
//         appSettings: [QUESTION_SETTING, ANSWERS_SETTING],
//       },
//       {
//         context: Context.Player,
//         permission: PermissionLevel.Read,
//       },
//     );
//     cy.visit(`/`);
//   });

//   it('test question and answers are visible', () => {
//     const { answers } = ANSWERS_SETTING.data;
//     answers.forEach((ans, index) => {
//       cy.get(buildDataCy(makeMcqAnswersCy(index))).should('be.visible');
//     });
//     cy.get(buildDataCy(makeMcqMultipleAnswersCy(0))).should('not.exist');

//     cy.get(buildDataCy(MCQ_QUESTION_CY)).should('be.visible');
//   });
// });

// describe('Player View configured for multiple answer', () => {
//   beforeEach(() => {
//     cy.setUpApi(
//       {
//         appSettings: [QUESTION_SETTING, ANSWERS_SETTING_MULTI_ANSWERS],
//       },
//       {
//         context: Context.Player,
//         permission: PermissionLevel.Read,
//       },
//     );
//     cy.visit(`/`);
//   });

//   it('test question and answers are visible', () => {
//     const { answers } = ANSWERS_SETTING_MULTI_ANSWERS.data;
//     answers.forEach((ans, index) => {
//       cy.get(buildDataCy(makeMcqMultipleAnswersCy(index))).should('be.visible');
//     });

//     cy.get(buildDataCy(makeMcqAnswersCy(0))).should('not.exist');

//     cy.get(buildDataCy(MCQ_QUESTION_CY)).should('be.visible');
//   });
// });
