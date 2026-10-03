import assert from 'node:assert/strict'
import { test } from 'node:test'
import { demoScenarios } from './demo-scenarios'
import { matchResources } from '../lib/matcher'
import { organizations, resourceListings, getResourceDetails } from '../lib/resources'

for (const scenario of demoScenarios) {
  test(scenario.id, () => {
    const results = matchResources(scenario.need)
    assert.equal(results[0]?.resourceId, scenario.expectedTopResourceId)
    assert.ok(results.length <= 3)
    assert.ok(results.slice(1).every(r => scenario.acceptableAlternateResourceIds.includes(r.resourceId)))
    assert.deepEqual(results, matchResources(scenario.need))
    for (const result of results) {
      assert.ok(result.reasons.length)
      assert.ok(getResourceDetails(result.resourceId))
    }
  })
}
const need = demoScenarios[0].need
const shelter = resourceListings.find(r => r.id === 'demo-family-shelter')!
test('local coverage excludes other cities, regions, countries, and missing locality', () => {
  for (const location of [
    { country: 'US', region: 'NC', city: 'Raleigh' },
    { country: 'US', region: 'SC', city: 'Charlotte' },
    { country: 'CA', region: 'NC', city: 'Charlotte' },
    { country: 'US' },
  ]) assert.deepEqual(matchResources({ ...need, location }, [shelter]), [])
  assert.equal(matchResources({ ...need, location: { country: ' us ', region: 'nc', city: 'CHARLOTTE' } }, [shelter]).length, 1)
})
test('inactive, wrong category, empty catalog, immediate danger and unknown country yield no matches', () => {
  assert.deepEqual(matchResources(need, [{ ...shelter, status: 'inactive' }]), [])
  assert.deepEqual(matchResources({ ...need, category: 'medical' }, [shelter]), [])
  assert.deepEqual(matchResources(need, []), [])
  assert.deepEqual(matchResources({ ...need, urgency: 'immediate_danger' }), [])
  assert.deepEqual(matchResources({ ...need, location: { country: '' } }), [])
})
test('all listings resolve and have provenance, limitations, freshness and truthful actions', () => {
  assert.equal(new Set(resourceListings.map(r => r.id)).size, resourceListings.length)
  assert.equal(organizations.filter(o => !o.fictional).length, 5)
  for (const resource of resourceListings) {
    assert.ok(organizations.some(o => o.id === resource.organizationId))
    assert.ok(resource.source && resource.lastUpdated && resource.limitations.length)
    assert.equal(resource.availability, 'unverified_demo')
    assert.deepEqual(resource.nextAction, { type: 'view_details', label: 'View details', resourceId: resource.id })
  }
})
test('access, population, language and urgency affect ranking; duplicate preferences do not inflate scores', () => {
  const clinicNeed = demoScenarios[1].need
  const clinic = resourceListings.find(r => r.id === 'demo-accessible-clinic')!
  const generic = { ...clinic, id: 'generic', populations: [], accessNeeds: [], languages: [], urgencies: [] }
  assert.equal(matchResources(clinicNeed, [generic, clinic])[0].resourceId, clinic.id)
  assert.deepEqual(matchResources({ ...clinicNeed, populations: [...clinicNeed.populations, ...clinicNeed.populations], languages: ['en', 'EN'] }, [clinic]), matchResources(clinicNeed, [clinic]))
})
test('ties use resource ID, independent of catalog order', () => {
  const a = { ...shelter, id: 'a' }, b = { ...shelter, id: 'b' }
  assert.deepEqual(matchResources(need, [b, a]).map(r => r.resourceId), ['a', 'b'])
})
