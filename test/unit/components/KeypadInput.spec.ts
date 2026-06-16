import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import KeypadInput from '~/components/KeypadInput.vue'

describe('KeypadInput', () => {
  it('builds up a value as digits are pressed', async () => {
    const wrapper = mount(KeypadInput)
    await wrapper.find('[data-key="4"]').trigger('click')
    await wrapper.find('[data-key="8"]').trigger('click')
    expect(wrapper.find('[data-testid="entry"]').text()).toBe('48')
  })

  it('delete removes the last digit', async () => {
    const wrapper = mount(KeypadInput)
    await wrapper.find('[data-key="4"]').trigger('click')
    await wrapper.find('[data-key="8"]').trigger('click')
    await wrapper.find('[data-key="del"]').trigger('click')
    expect(wrapper.find('[data-testid="entry"]').text()).toBe('4')
  })

  it('emits submit with the entered value', async () => {
    const wrapper = mount(KeypadInput)
    await wrapper.find('[data-key="7"]').trigger('click')
    await wrapper.find('[data-key="ok"]').trigger('click')
    expect(wrapper.emitted('submit')?.[0]).toEqual(['7'])
  })
})
