const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.key);

async function getPackagesByPerson(customerName) {
  const { data, error } = await supabase
    .from('package_summary')
    .select('*')
    .ilike('customer_name', `%${customerName}%`)
    .eq('status', 'active');

  if (error) throw error;
  return data;
}

async function getPackagesByType(packageType) {
  const { data, error } = await supabase
    .from('package_summary')
    .select('*')
    .ilike('package', `%${packageType}%`)
    .eq('status', 'active');

  if (error) throw error;
  return data;
}

module.exports = {
  getPackagesByPerson,
  getPackagesByType
};