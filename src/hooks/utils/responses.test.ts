import cloneDeep from 'lodash.clonedeep';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

import { ResponseAppData } from '@/config/appDataTypes';

import { mockItem, mockMembers } from '../../mocks/db';
import { buildMockResponses } from '../../mocks/mockResponses';
import {
  extractNResponsesThatDontHaveMemberAsCreator,
  filterBotResponses,
  recursivelyCreateAllPartiallyBlindSets,
} from './responses';

const getMapResponses = (): Map<string, ResponseAppData> => {
  const mockResponses = buildMockResponses(mockItem, mockMembers);
  return new Map(mockResponses.map((r) => [r.id, r]));
};

beforeAll(() => {
  vi.stubGlobal('Cypress', false);
});
afterAll(() => {
  vi.unstubAllGlobals();
});

test('the mocks are good', () => {
  const mapResponses = getMapResponses();
  expect(mapResponses).to.be.a('map');
  expect(mapResponses).not.toBeUndefined();
  // This value should more or less correspond to the mocks.
  expect(mapResponses.size).to.be.greaterThanOrEqual(12);
});

test('the response map is passed by reference and remains the same', () => {
  const mapResponses = getMapResponses();

  const [, newMapR] = extractNResponsesThatDontHaveMemberAsCreator(
    mapResponses,
    2,
    mockMembers[0].id,
  );
  expect(newMapR).to.be.equal(mapResponses);
});

test('extracting two responses', () => {
  const mapResponses = getMapResponses();
  const n = 2;
  const initialSize = mapResponses.size;

  const [r, newMapR] = extractNResponsesThatDontHaveMemberAsCreator(
    mapResponses,
    n,
    mockMembers[0].id,
  );
  expect(r.length).to.equals(n);
  expect(newMapR.size).equals(initialSize - n);
});

test('extracting zero responses gives empty array', () => {
  const mapResponses = getMapResponses();
  const copyOfMapResponses = cloneDeep(mapResponses);
  const n = 0;

  const [r, newMapR] = extractNResponsesThatDontHaveMemberAsCreator(
    mapResponses,
    n,
    mockMembers[0].id,
  );
  expect(r).to.be.empty('');
  expect(newMapR).to.be.deep.equals(copyOfMapResponses);
});

test('extracting more responses than available gives all available', () => {
  const mapResponses = getMapResponses();
  const n = mapResponses.size + 2;
  const accountId = mockMembers[0].id;

  const [r] = extractNResponsesThatDontHaveMemberAsCreator(
    mapResponses,
    n,
    accountId,
  );
  expect(r.length).to.be.lessThan(n);
  expect(r.map(({ creator }) => creator?.id !== accountId))
    .to.be.an('array')
    .that.does.not.include(false);
});

test('recursively create all sets', () => {
  const mapResponses = getMapResponses();
  const participantIterator = mockMembers.entries();
  const sets = recursivelyCreateAllPartiallyBlindSets(
    participantIterator,
    mapResponses,
    new Map(),
    3,
    1,
  );
  expect(sets.size).not.toBe(0);
  expect(sets).to.have.keys(mockMembers.map(({ id }) => id));
});

test('filtering bot responses', () => {
  const responsesMap = getMapResponses();
  const responses = Array.from(responsesMap.values());

  expect(responses.length).toBeGreaterThanOrEqual(3);

  responses[0].data.bot = false;
  responses[2].data.bot = true;

  expect(filterBotResponses(responses))
    .to.be.an('array')
    .that.has.length.greaterThanOrEqual(2)
    .that.contain.oneOf(responses);
  expect(filterBotResponses(responses, true))
    .to.be.an('array')
    .that.has.length(1)
    .that.contain.oneOf(responses);
});
